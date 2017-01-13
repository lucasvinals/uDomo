const ENV = 'development'; // "development" or "production"

const log = {
    success: (m) => {
        console.log(
            '\n\x1b[1m\x1b[42m' +
            Array(85).join('-') +
            '\x1b[0m' + '\n' +
            '\x1b[1m\x1b[42m' +
            Array(10).join(' ') +
            m +
            Array(Math.abs(75 - m.length) + 1).join(' ') +
            '\x1b[0m' + '\n' +
            '\x1b[1m\x1b[42m' +
            Array(85).join('-') +
            '\x1b[0m\n'
        );
    },
    error: (m) => {
        console.log(
            '\n\x1b[41m\x1b[37m' +
            Array(76).join('-') +
            '\n\n[Syntax Error]\n\n' +
            m +
            Array(76).join('-') +
            '\x1b[0m'
        );
    },
    info: (m) => {
        console.log(
            '\n\x1b[44m\x1b[37m' +
            Array(85).join('-') +
            '\x1b[0m' + '\n' +
            '\x1b[44m\x1b[37m' +
            Array(20).join(' ') +
            m.toUpperCase() +
            Array(Math.abs(65 - m.length) + 1).join(' ') +
            '\x1b[0m' + '\n' +
            '\x1b[44m\x1b[37m' +
            Array(85).join('-') +
            '\x1b[0m\n'
        );
    }
};

const gulp          = require('gulp');
const concat        = require('gulp-concat');
const cleanCSS      = require('gulp-clean-css');
const processHTML   = require('gulp-processhtml');
const checkSyntax   = require('./tests/checkSyntax');
const psi           = require('psi');
const googleCC      = require('google-closure-compiler-js').gulp;

function psilog(speed, usability, type) {
    speed < 30 && log.error('Speed score for ' + type + ': ' + speed);
    speed > 29 && speed < 70 && log.info('Speed score for ' + type + ': ' + speed);
    speed > 69 && log.success('Speed score for ' + type + ': ' + speed);

    usability < 30 && log.error('Usability score for ' + type + ': ' + usability);
    usability > 29 && usability < 70 && log.info('Usability score for ' + type + ': ' + usability);
    usability > 69 && log.success('Usability score for ' + type + ': ' + usability);
};

/**
 *  TASK - Compress Javascript Libraries and Modules in 'udomo.min.js' script 
 */
gulp.task('buildLibs', () => {
    gulp.src([
            /**
             * Intentar sacar jquery, modal y dropdown. Hacerlo solo con CSS
             * No debería ser necesario tener jQuery para esta pavada
             */ 
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/bootstrap/js/modal.js',
            './node_modules/bootstrap/js/dropdown.js',
            /**************************************************************/
            './node_modules/alertifyjs/build/alertify.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-ui-router/release/angular-ui-router.min.js',
            './node_modules/socket.io-client/dist/socket.io.min.js',
            './node_modules/lodash/lodash.min.js'])
        /**
         * Concatenate all
         */
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest('./udomo/js'));
})
/**
 *  TASK - Compress Javascript Libraries and Modules in 'udomo.min.js' script 
 */
.task('jsScripts', ['buildLibs'], () => {
    if(ENV === 'development'){
        gulp.src(['./client/js/**/*']).pipe(gulp.dest('./udomo/js'));
    }else if (ENV === 'production'){
         gulp
            .src([
                './udomo/js/lib.min.js',
                './client/js/services/**/*.js',
                './client/js/filters/*.js',
                './client/js/controllers/**/*.js',
                './client/js/directives/*.js',
                './client/js/app.js',
                './client/js/routes.js'
            ])
             /**
             * Minify all and concatenate. 
             * Takes some time at build time but using this it's 
             * much faster than all scripts separated 
             */
            .pipe(googleCC()({
                compilationLevel: 'SIMPLE',
                jsOutputFile: 'udomo.min.js',
                angularPass: true
            }))
            .pipe(gulp.dest('./udomo/js'));
    }
})

/**
 *  TASK - Minify all CSS files and concat into one single file 
 */
.task('minStyles', () => {
    gulp.src([
            './node_modules/bootstrap/dist/css/bootstrap.min.css',
            './node_modules/alertifyjs/build/css/alertify.min.css',
            './node_modules/alertifyjs/build/css/themes/semantic.min.css',
            // './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.css',
            './client/css/style.css'
        ])
        .pipe(cleanCSS())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('./udomo/css'));
})

/**
 * TASK - fonts/ -> .woff y .woff2  para renderizar bien los íconos
 */
.task('copyStatic', () => {
    gulp.src('./node_modules/bootstrap/fonts/*.wof*')
        .pipe(gulp.dest('./udomo/fonts'));
    gulp.src('./client/views/**/*')
        .pipe(processHTML({
                            data:{ versionApp: Math.floor(Math.random() * 1000) },
                            environment: (ENV === 'development'? 'development': 'production')
                        }))
        .pipe(gulp.dest('./udomo/views'));
    gulp.src('./client/img/**/*')
        .pipe(gulp.dest('./udomo/img'));
})

/**
 * TASK - Clean all files in 'udomo' directory
 */
.task('clean', () => {
    let removeFiles = require('./tools/removeFiles');
    removeFiles("udomo/", function(){});
    removeFiles("shelljs_*", function(){});
    removeFiles("*.log", function(){});
})

/**
 * TASK - Search errors in server/client files
 */
.task('checkSyntax', () => {
    checkSyntax(log);
})

/**
 * PageSpeed tests
 * ngrok fails...
 */
.task('mobileTest', () => {
    return psi('localhost', {
        nokey: 'true',
        strategy: 'mobile',
    }).then((data) => {
        psilog(data.ruleGroups.SPEED.score, data.ruleGroups.USABILITY.score, 'Mobile');
    });
})

.task('desktopTest', () => {
    return psi('localhost', {
        nokey: 'true',
        strategy: 'desktop',
    }).then((data) => {
        psilog(data.ruleGroups.SPEED.score, 0, 'Desktop');
    });
})

/**
 * TASK - Build actions
 */
.task('build',  [
                        'clean',
                        'checkSyntax',
                        'copyStatic',
                        'minStyles',
                        'jsScripts'
                    ]
);
/**
 * Set this to "development" or "production"
 * to build or bundle libraries
 */
process.environment = 'development';
const removeFiles = require('./server/tools/remove-files');
const checkSyntax = require('./server/tests/check-syntax');
const { log } = process;
const nodemon = require('gulp-nodemon');
const psi = require('psi');
const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const processHTML = require('gulp-processhtml');
const { gulp: googleCC } = require('google-closure-compiler-js');

function psilog(speed, usability, type) {
  const SPEED_MIN = 40;
  const SPEED_MAX = 80;

  switch (speed) {
    case speed < SPEED_MIN:
      log.error(`Speed score for ${ type }: ${ speed }`);
      break;
    case speed >= SPEED_MIN && speed <= SPEED_MAX:
      // log.warning(`Speed score for ${ type }: ${ speed }`);
      break;
    case speed > SPEED_MAX:
      log.success(`Speed score for ${ type }: ${ speed }`);
      break;
    default:
      break;
  }

  const USABILITY_MIN = 40;
  const USABILITY_MAX = 80;

  switch (usability) {
    case usability < USABILITY_MIN:
      log.error(`Usability score for ${ type }: ${ usability }`);
      break;
    case usability >= USABILITY_MIN && usability <= USABILITY_MAX:
      // log.warning(`Usability score for ${ type }: ${ usability }`);
      break;
    case usability > USABILITY_MAX:
      log.success(`Usability score for ${ type }: ${ usability }`);
      break;
    default:
      break;
  }
}

/**
 *  TASK - Compress Javascript Libraries and Modules in 'udomo.min.js' script
 */
gulp.task('buildLibs', () => {
  gulp.src(
    [
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
      './node_modules/lodash/lodash.min.js' ])
  /**
   * Concatenate all
   */
  .pipe(concat('lib.min.js'))
  .pipe(gulp.dest('./udomo/js'));
})
/**
 *  TASK - Compress Javascript Libraries and Modules in 'udomo.min.js' script
 */
.task('jsBuild', [ 'buildLibs' ], (done) => {
  if (process.environment === 'development') {
    gulp
      .src([ './client/js/**/*' ])
      .pipe(gulp.dest('./udomo/js'))
      .on('end', done);
  } else if (process.environment === 'production') {
    gulp
      .src([
        './udomo/js/lib.min.js',
        './client/js/services/**/*.js',
        './client/js/filters/*.js',
        './client/js/controllers/**/*.js',
        './client/js/directives/*.js',
        './client/js/app.js',
        './client/js/routes.js',
      ])
        /**
       * Minify all and concatenate.
       * Takes some time at build time but using this it's
       * much faster than all scripts separated
       */
      .pipe(googleCC()(
        {
          compilationLevel: 'SIMPLE',
          jsOutputFile: 'udomo.min.js',
          angularPass: true,
        }))
      .pipe(gulp.dest('./udomo/js'))
      .on('end', () => {
        removeFiles('/root/uDomo/udomo/js/lib.min.js');
        done();
      });
  }
})

/**
 *  TASK - Minify all CSS files and concat into one single file
 */
.task('minStyles', () => {
  gulp.src(
    [
      './node_modules/bootstrap/dist/css/bootstrap.min.css',
      './node_modules/alertifyjs/build/css/alertify.min.css',
      './node_modules/alertifyjs/build/css/themes/semantic.min.css',
      // './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.css',
      './client/css/style.css',
    ])
    .pipe(cleanCSS())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./udomo/css'));
})

/**
 * TASK - fonts/ -> .woff y .woff2  para renderizar bien los íconos
 */
.task('copyStatic', () => {
  const mil = 1000;
  gulp
    .src('./client/views/**/*')
    .pipe(processHTML(
      {
        'data': { versionApp: Math.floor(Math.random() * mil) },
        environment: (process.environment === 'development' ? 'development' : 'production'),
      }))
    .pipe(gulp.dest('./udomo/views'))
    .on('end', () => {
      gulp
        .src('./client/img/**/*')
        .pipe(gulp.dest('./udomo/img'))
        .on('end', () => {
          gulp
            .src('./node_modules/bootstrap/fonts/*.*')
            .pipe(gulp.dest('./udomo/fonts'));
        });
    });
})

/**
 * TASK - Clean all files in 'udomo' directory
 */
.task('clean', () => {
  removeFiles('udomo');
  removeFiles('*.log');
})

/**
 * TASK - Search errors in server/client files
 */
.task('checkSyntax', [ 'clean' ], () => checkSyntax(
  [
    './client/js/**/*.js',
    './server/api/**/*.js',
    './server/config/**/*.js',
    './*.js',
    './server/tests/**/*.js',
    './server/tools/**/*.js',
  ]
))

/**
 * PageSpeed tests
 * ngrok fails...
 */
.task('mobileTest', () => psi('localhost',
  {
    nokey: 'true',
    strategy: 'mobile',
  }).then((mobileData) =>
    psilog(mobileData.ruleGroups.SPEED.score, mobileData.ruleGroups.USABILITY.score, 'Mobile'))
)

.task('desktopTest', () =>
  psi('localhost', { nokey: 'true', strategy: 'desktop' })
    .then((desktopData) => psilog(desktopData.ruleGroups.SPEED.score, 0, 'Desktop'))
)

.task('build',
  [
    'checkSyntax',
    'copyStatic',
    'minStyles',
    'jsBuild',
  ]
)

.task('default', [ 'build' ], () =>
  nodemon(
    {
      script: 'cluster.js',
      args: [ '12078', process.environment === 'development' ? '1' : '' ],
      watch: [ './server', './client' ],
      ext: 'js html css',
      env: { 'NODE_ENV': process.environment },
      tasks: [ 'build' ],
    }
  )
);

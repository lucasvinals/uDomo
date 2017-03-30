const gulp = require('gulp');
const { gulp: googleCC } = require('google-closure-compiler-js');
const concat = require('gulp-concat');
const { execSync: Bash } = require('child_process');
const removeFiles = require(`${ process.ROOTDIR }/server/tools/remove-files`);

function development() {
  return Bash(`cp -R ${ process.ROOTDIR }/client/js/ ${ process.ROOTDIR }/udomo`);
}

function production() {
  gulp
    .src([
      `${ process.ROOTDIR }/udomo/js/lib.min.js`,
      `${ process.ROOTDIR }/client/js/services/**/*.js`,
      `${ process.ROOTDIR }/client/js/filters/*.js`,
      `${ process.ROOTDIR }/client/js/controllers/**/*.js`,
      `${ process.ROOTDIR }/client/js/directives/*.js`,
      `${ process.ROOTDIR }/client/js/app.js`,
      `${ process.ROOTDIR }/client/js/routes.js`,
    ])
    /**
     * Minify all and concatenate.
     * Takes some time at build time but using this it's
     * much faster than all scripts separated
     */
    .pipe(
      googleCC()(
        {
          compilationLevel: 'SIMPLE',
          jsOutputFile: 'udomo.min.js',
          angularPass: true,
        }
      )
    )
    .pipe(gulp.dest(`${ process.ROOTDIR }/udomo/js`))
    .on('end', () => removeFiles(`${ process.ROOTDIR }/udomo/js/lib.min.js`));
}

const envs = {
  production,
  development,
};

function buildLibs() {
  return gulp
    .src([
      /**
       * Intentar sacar jquery, modal y dropdown. Hacerlo solo con CSS
       * No debería ser necesario tener jQuery para esta pavada
       */
      `${ process.ROOTDIR }/node_modules/jquery/dist/jquery.min.js`,
      `${ process.ROOTDIR }/node_modules/bootstrap/js/modal.js`,
      `${ process.ROOTDIR }/node_modules/bootstrap/js/dropdown.js`,
      /*************************************************************/
      `${ process.ROOTDIR }/node_modules/alertifyjs/build/alertify.min.js`,
      `${ process.ROOTDIR }/node_modules/angular/angular.min.js`,
      `${ process.ROOTDIR }/node_modules/angular-ui-router/release/angular-ui-router.min.js`,
      `${ process.ROOTDIR }/node_modules/socket.io-client/dist/socket.io.min.js`,
      `${ process.ROOTDIR }/node_modules/lodash/lodash.min.js`,
    ])
  /**
   * Concatenate libs
   */
  .pipe(concat('lib.min.js'))
  .pipe(gulp.dest(`${ process.ROOTDIR }/udomo/js`))
  .on('end', () => envs[`${ process.env.NODE_ENV }`]());
}

gulp.task('js', buildLibs);

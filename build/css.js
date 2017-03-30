const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

function minifyCSS() {
  /**
   * Compact and minify styles
   */
  gulp.src(
    [
      `${ process.ROOTDIR }/node_modules/bootstrap/dist/css/bootstrap.min.css`,
      `${ process.ROOTDIR }/node_modules/alertifyjs/build/css/alertify.min.css`,
      `${ process.ROOTDIR }/node_modules/alertifyjs/build/css/themes/semantic.min.css`,
      `${ process.ROOTDIR }/client/css/style.css`,
    ])
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${ process.ROOTDIR }/udomo/css`));
}

gulp.task('css', () => minifyCSS());

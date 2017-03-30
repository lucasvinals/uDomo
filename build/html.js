const gulp = require('gulp');
const processHTML = require('gulp-processhtml');
const clientViews = `${ process.ROOTDIR }/client/views/**/*`;
const buildViews = `${ process.ROOTDIR }/udomo/views`;
const { random } = require('lodash');
function buildHTML() {
  const rand = 1000;
  return gulp
    .src(clientViews)
    .pipe(processHTML(
      {
        'data': { versionApp: random(1, rand) },
        environment: process.env.NODE_ENV,
      }))
    .pipe(gulp.dest(buildViews));
}

gulp.task('html', () => buildHTML());

const gulp = require('gulp');
const checkSyntax = require('../server/tests/check-syntax');
const paths = [
  './client/js/**/*.js',
  './server/api/**/*.js',
  './server/config/**/*.js',
  './*.js',
  './server/tests/**/*.js',
  './server/tools/**/*.js',
];

gulp.task('syntax', () => checkSyntax(paths));

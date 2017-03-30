const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const nodemonConfig = require('../server/config/nodemon');

gulp.task('nodemon', () => nodemon(nodemonConfig));

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const nodemonConfig = require('../server/config/nodemon');
const { binary, storage } = require('../server/config/db');
const { execFile } = require('child_process');

/**
 * This graceful clear processes is because nodemon has a bug
 * that prevents node instances close appropriately.
 */
gulp.task('gracefullyClear', () => {
  execFile(`${ binary }`, [ '--dbpath', `${ storage }`, '--shutdown' ], { timeout: 15000 });
  execFile('killall', [ 'node' ], { timeout: 15000 });
});

gulp.task('nodemon', () => nodemon(nodemonConfig));

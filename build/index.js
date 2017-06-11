const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('default', (done) => runSequence('clean', 'syntax', 'static', 'html', 'css', 'js', 'nodemon', done));

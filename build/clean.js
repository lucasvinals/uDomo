const gulp = require('gulp');
const removeFiles = require('../server/tools/remove-files');

const paths = [
  `${ process.ROOTDIR }/udomo`,
  `${ process.ROOTDIR }/*.log`,
];

gulp.task('clean', () => paths.map((path) => removeFiles(path)));

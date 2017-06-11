const { execSync } = require('child_process');
const gulp = require('gulp');
const clientImg = `${ process.ROOTDIR }/client/img`;
const buildPath = `${ process.ROOTDIR }/udomo`;
const fontPath = `${ process.ROOTDIR }/node_modules/bootstrap/fonts`;

function copyStatic() {
  /**
   * Images
   */
  execSync(`mkdir -p ${ buildPath }/img && cp -R ${ clientImg } ${ buildPath }`);
  /**
   * Fonts
   */
  execSync(`cp -R ${ fontPath } ${ buildPath }`);
}

gulp.task('static', () => copyStatic());

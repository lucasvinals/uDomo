const { execSync: Bash } = require('child_process');
module.exports = (path) => Bash(`rm -rf ${ path }`);

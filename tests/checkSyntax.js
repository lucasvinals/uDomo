const fs        = require('fs');
const check     = require('syntax-error');
const tester    = require('glob');

module.exports = (log) => {
    /**
     * Server
     */
    log.info('Checking server files for syntax errors');
    const serverArray = [
        './app/**/*.*',
        './config/*.*',
        './*.js',
        './sensors/**/*.js',
        './tests/**/*.js',
        './tools/**/*.js'
    ];
    serverArray.forEach((pattern) => {
        tester.sync(pattern).forEach((f) => {
            let error = check(fs.readFileSync(f), f);
            error ?
                log.error(error) :
                log.success(' File: \"' + f + '\" -> Syntax OK ');
        });
    });

    /**
     * Client
     */
    log.info('Checking client js files for syntax errors');
    tester.sync("./client/js/**/*.js").forEach((f) => {
        let error = check(fs.readFileSync(f), f);
        error ?
            log.error(error) :
            log.success(' File: \"' + f + '\" -> Syntax OK ');
    });
};
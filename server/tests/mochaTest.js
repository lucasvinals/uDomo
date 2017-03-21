var mocha   = require('mocha')({
    ui: 'tdd',
    reporter: 'list'
});
var testDir = './client';

const fs = require('fs'); 

fs.readdirSync(testDir).filter(function(file){
    return file.substr(-3) === '.js'; // Only keep the .js files
}).forEach(function(file){
    mocha.addFile(require('path').join(testDir, file));
});

// Run the tests.
mocha.run(function(failures){
    process.on('exit', function () {
        process.exit(failures);  // exit with non-zero status if there were failures
    });
});
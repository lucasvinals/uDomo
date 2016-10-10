/* Private Object */
var sensors = {
    pyServer :  {
		fileName: "server",
        extension: ".py",
        dir: "sensors/python/"
	},
    pyDummy : {
		fileName: "dummy",
        extension: ".py",
        dir: "../sensors/dummies/"
	},
    jsServer : {
        fileName: "server",
        extension: ".js",
        dir: "../../sensors/js/"
    },
    jsDummy : {
        fileName: "dummy",
        extension: ".js",
        dir: "../../sensors/dummies/"
    }
};

/* Function to call when request sensors object */
var getSens = () => { 
    return sensors; 
};

/* Public Function */
module.exports = getSens();
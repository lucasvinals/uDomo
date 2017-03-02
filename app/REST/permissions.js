const PermissionsSchema = require("../models/permissions");
var log = log || process.log;

const Permissions = {
    FindPermissions: (callback) => {
        PermissionsSchema.find({}, (e, p) => {
            e?
                (!log.error(e) && callback(e, null)):
                callback(null, p);
        });
    }
};

module.exports = (app) => {
    app
    .get('/api/Permissions', (request, response) => {
        Permissions.FindPermissions((error, permissions) => {
            response.json({"Permissions": permissions, "Error": error});
        });
    });
};
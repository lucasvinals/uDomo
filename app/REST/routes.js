var log     = log || process.log;

var Routes = {
    /****************************************** Find Areas **********************************************/
    RetrieveRoutes: (callback) => {
        require("../models/routes").find({}, (e, r) => {
            e ?
                callback(e, null) :
                callback(null, r);
        });
    }
};
/*************************************************************************************************************/

module.exports = (app) => {    
    app
    /************************************************** Request Routes ******************************************/
    .get('/api/Routes', (request, response) => {
        Routes.RetrieveRoutes((error, routes) => {
            response.json({Routes : routes, Error : error});
        });
    })
    /*************************************************************************************************************/
};
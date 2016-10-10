Areas.controller('areaController', ['$scope', 'Common', 'Area', 
 function($scope, Common, Area){
    'use strict';

    /*************************** Get Areas created with an IIFE  ***********************************/
    let getAreas = (function iifeGetAreas(){
        Area.GetAreas((error, areas) => {
            error? log.error('Error obteniendo áreas ->' + error) : $scope.areas = areas;
        });
        return iifeGetAreas;
    })();
    /***********************************************************************************************/
    
    /* With the Observer Pattern, register the function to trigger whenever Areas changes */
    Area.Subscribe(getAreas);
    /***********************************************************************************************/
    
    /***************************************** Create Area *****************************************/
    $scope.createArea = (area) => {
        area._id = Common.newID(); // Creates a new GUID-like string to save the object in DB.
        Area.CreateArea(area, (error, areaCreated) => {
           //log.success('Area Created with name: \"' + area.Name + '\"');
        });
    };
    /***********************************************************************************************/
    
    /************************************** Remove an Area *****************************************/
    $scope.removeArea = (index) => {
        Area.DeleteArea($scope.areas[index]._id);
    };
    /***********************************************************************************************/
    
    /* Clean exit */
    $scope.$on('$destroy', (event) => {
        Area.clearListeners();
    });
    /***********************************************************************************************/
}]);


var Common = angular.module('Common', []);

Common.factory('Common', ['$rootScope', 'Socket', ($rootScope, Socket) => {
    'use strict';
    /******* Logger para ponerle algo de color a la consola *********/
    /*var log = function(){};

    log.prototype = {
        error   : (m) => {
            console.log('%c' + m, 'color:red;font-weight:bold;');
        },
        success : (m) => {
            console.log('%c' + m, 'color:green;font-weight:bold;');
        },
        warning : (m) => {
            console.log('%c' + m, 'color:orange;font-weight:bold;');
        },
        info: (m) => {
            console.log('%c' + m, 'color:blue;font-weight:bold;');
        }
    };
    */
    class log{
        constructor(){}
        error   (m){console.log('%c' + m, 'color:red;font-weight:bold;');   }
        success (m){console.log('%c' + m, 'color:green;font-weight:bold;'); }
        warning (m){console.log('%c' + m, 'color:orange;font-weight:bold;');}
        info    (m){console.log('%c' + m, 'color:blue;font-weight:bold;');  }
    };
   
    window.log = new log();
    /*****************************************************************/

    // var user = Storage.getUser();
    
    // function checkLoggedUser(){
    //     typeof user == 'undefined' || user == null ? window.location.assign('/') : $rootScope.currentUser = user;
    // }
    /********************************************** Inits **************************************************/
    $rootScope.currentDevices = [];
    var lastMessageDate = 0;
    /*******************************************************************************************************/
    
    /*************** Helper function to combine 2 arrays and then return one with no duplicates ************/
    var objUnion = (array1, array2, matcher) => {
        return _.uniq(array1.concat(array2), false, matcher);
    };
    /*******************************************************************************************************/
    
    /*********************** This returns the time since the given date ************************************/
    let getTimeSince = (last) => {
            var total   = Date.now() - last,
                seconds = Math.floor((total/1000) % 60),
                minutes = Math.floor((total/1000/60) % 60),
                hours   = Math.floor((total/(1000*60*60)) % 24),
                days    = Math.floor(total/(1000*60*60*24));
        
            return {
                'total'     : total,
                'days'      : days,
                'hours'     : hours,
                'minutes'   : minutes,
                'seconds'   : seconds
        };
    }
    /*******************************************************************************************************/
    
    /* If the last message was sent more than X seconds, assume that no device is present and clear array */
    setInterval(() => {
        if(getTimeSince(lastMessageDate).seconds > 15){
            $rootScope.currentDevices = [];
        }
    }, 2000);
    /*******************************************************************************************************/

    /************************************* Add/update devices correspondingly ******************************/
    /*
    function addOrUpdateDevices(arrayDevices){
        var puedeAgregar = true;
        if($rootScope.currentDevices.length == 0){
            $rootScope.currentDevices.push(arrayDevices);
        }else{
            for(var i = 0, len = $rootScope.currentDevices.length; i < len; ++i){
                var e = $rootScope.currentDevices[i];
                if(e._id === arrayDevices._id){
                    puedeAgregar = false;
                    $rootScope.currentDevices[i] = arrayDevices;
                }else{
                    if(puedeAgregar){
                        var ind = -1;
                        $rootScope.currentDevices.forEach(function(s, w){
                            if(s._id == arrayDevices._id){
                                ind = w;
                            }
                        });
                        if(ind == -1){
                            $rootScope.currentDevices.push(arrayDevices);
                        }
                    }
                }
            }
        }
    }
    */
    /*******************************************************************************************************/
    
    /***************************** Devices already registered in the last seconds **************************/
    //Socket.on('clientDeviceRequest', function(deviceRequest){
        /* TODO: PUT THIS LOGIC IN THE SERVER AND RETURN THE UPDATED ARRAY.Quit an element when regDevices does not send it */
        /**** This adds the current values to $rootScope.currentDevices, but duplicates by '_id' ***/
      //  lastMessageDate = Date.now();
      //  addOrUpdateDevices(deviceRequest);
    //});
    /*******************************************************************************************************/

    /************************************* Create a new string GUID-like ***********************************/
    let createGUID = () => { // Creates a new GUID-like string to save the object in DB.
      let fourChars = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return fourChars() + fourChars() + '-' + fourChars() + '-' + fourChars() + '-' +
        fourChars() + '-' + fourChars() + fourChars() + fourChars();
    }
    /*******************************************************************************************************/

    return{
        newID : () => {
            return createGUID();
        },
        checkLogged: () => {
            return checkLoggedUser();
        },
        since: (val) => {
            return getTimeSince(val);
        },
        concatenate: (args) => {
            return objUnion(args[0], args[1], args[2]);
        },
        activeDevices : (ind) => {
            return $rootScope.currentDevices[ind];
        }
        
    }
}]);
Devices.controller('deviceController', ['Device', 'Area', '$scope',
function(Device, Area, $scope){
    'use strict';
    
    let lastID = '';
    $scope.devices = [];

    let setDeviceInfo = () => {
        $scope.deviceInfo = $scope.devices.filter((dev) => dev._id == lastID)[0];
    };

    /************************* Get all devices, online and saved ***********************************/
    let getDevices = (function iifeGetDevices(){
        Device.getDevices((error, devices) => {
            if(error){
                log.error('Error obteniendo dispositivos de la base de datos ->' + error);
            }else{
                $scope.devices = devices;
                setDeviceInfo();
                $scope.cantidadDisp = $scope.devices.length;
            }
        });
        return iifeGetDevices;
    })();
    /***********************************************************************************************/

    /************************************** Observer pattern ***************************************/
    Device.Subscribe(getDevices);
    /***********************************************************************************************/

    /**************************************** Save a Device ****************************************/
    $scope.saveDevice = (device) => {
        try{
            device.Saved = true;
            device.Area = $scope.availableAreas.filter((area) => area._id == device.areaSelected)[0];
            Device.saveDevice(device, (error, deviceSaved) => {
                error ?
                    log.error('No se pudo guardar el dispositivo -> ' + error) :
                    log.success('Device \'' + deviceSaved.Name + '\' successfully saved');
            });
        }catch(e){
            log.error('Ocurrió un problema guardando el dispositivo -> ' + e.stack);
        }
    };
    /***********************************************************************************************/

    /************************************** Remove a Device ****************************************/
    $scope.removeDevice = (id) => {
        try {
            Device.deleteDevice(id);
        } catch (ex) {
            log.error('Ocurrió un problema al eliminar el dispositivo: ' + ex.stack);
        }
    };
    /***********************************************************************************************/

    $scope.tempDevice = (index) => {
        $scope.tmpDevice = $scope.devices[index];

        Area.GetAreas((error, areas) => {
            error ?
                log.error('Error obteniendo áreas.') :
                $scope.availableAreas = areas;
        });
    };

    $scope.changePin = (_id, Pin, val) => {
        Device.sendMessage('clientChangePin', {
                                                '_id'   : _id,
                                                'pin'   : +Pin,
                                                'value' : val === 0 ? 1023 : 0
                                              });
    };

    /* Mejora. Iniciar los modales desde acá, no en la vista */
    $scope.viewInfoDevice = (devID) => {
        lastID = devID;
        setDeviceInfo();
    };

    $scope.estaOnline   = () => typeof $scope.deviceInfo !== 'undefined' && $scope.deviceInfo.Online === true || false;
    $scope.estaGuardado = () => typeof $scope.deviceInfo !== 'undefined' && $scope.deviceInfo.Saved  === true || false;

    /* Clean exit */
    $scope.$on('$destroy', (event) => {
        $('#saveDeviceModal').modal('hide');
        Device.clearListeners('updateDevices');
    });
}]);

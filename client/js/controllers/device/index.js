/* eslint id-length:0 */
import Device from '../../services/device';
import Zone from '../../services/zone';
import $ from 'jquery';

function DeviceController($scope, $window) {
  let lastID = '';
  $scope.devices = [];

  function setDeviceInfo() {
    [ $scope.deviceInfo ] = $scope.devices.filter((dev) => _.get(dev, '_id') === lastID);
  }

  const getDevices = (function iifeGetDevices() {
    Device.getDevices((error, devices) => {
      if (error) {
        window.log.error(`Error obteniendo dispositivos de la base de datos -> ${ error }`);
      } else {
        $scope.devices = devices;
        setDeviceInfo();
        $scope.cantidadDisp = $scope.devices.length;
      }
    });
    return iifeGetDevices;
  }());

  /**
   * Observer
   */
  Device.Subscribe(getDevices);

  $scope.saveDevice = (device) => {
      try{
          device.Saved = true;
          device.Zone = $scope.availableZones.filter((zone) => zone._id == device.zoneSelected)[0];
          Device.saveDevice(device, (error, deviceSaved) => {
              error ?
                  log.error('No se pudo guardar el dispositivo -> ' + error) :
                  log.success('Device \'' + deviceSaved.Name + '\' successfully saved');
          });
      }catch(e){
          log.error('Ocurrió un problema guardando el dispositivo -> ' + e.stack);
      }
  };

  $scope.removeDevice = (id) => {
      try {
          Device.deleteDevice(id);
      } catch (ex) {
          log.error('Ocurrió un problema al eliminar el dispositivo: ' + ex.stack);
      }
  };

  $scope.tempDevice = (index) => {
      $scope.tmpDevice = $scope.devices[index];

      Zone.GetZones((error, zones) => {
          error ?
              log.error('Error obteniendo áreas.') :
              $scope.availableZones = zones;
      });
  };

  $scope.changePin = (_id, Pin, val) => {
      Device.sendMessage(
          'rChangePin', {
                          "_id"   : _id,
                          "pin"   : +Pin,
                          "value" : val,
                          "mode"  : "digital"
                      });
  };

  /* Mejora. Iniciar los modales desde acá, no en la vista */
  $scope.viewInfoDevice = (devID) => {
      lastID = devID;
      setDeviceInfo();
  };

  $scope.estaOnline   = () => typeof $scope.deviceInfo !== 'undefined' && $scope.deviceInfo.Online === true || false;
  $scope.estaGuardado = () => typeof $scope.deviceInfo !== 'undefined' && $scope.deviceInfo.Saved  === true || false;

  $scope.programDevice = function(ip){
      $window.open("http://" + ip + "/device", "_blank");
  };

  /* Clean exit */
  $scope.$on('$destroy', (event) => {
    $('#saveDeviceModal').modal('hide');
    Device.clearListeners('updateDevices');
  });
}

export default angular.module('uDomo.Device').controller('deviceController', [ '$scope', '$window', DeviceController ]);

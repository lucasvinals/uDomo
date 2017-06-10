import { inject, controller } from 'ng-annotations';
import { get } from 'lodash';

@controller('ControllerDevice')
@inject('FactoryDevice', 'FactoryZone', '$window', '$scope')
export default class {
  constructor(Device, Zone, $window, scope) {
    this.Device = Device;
    this.Zone = Zone;
    this.window = $window;
    this.scope = scope;
    this.devices = [];
    this.lastID = '';
    this.Device.Subscribe(this.GetDevices);
    this.EstaOnline = () => (typeof this.deviceInfo !== 'undefined' && this.deviceInfo.Online === true) || false;
    this.EstaGuardado = () => (typeof this.deviceInfo !== 'undefined' && this.deviceInfo.Saved === true) || false;
    /* Clean exit */
    this.scope.$on('$destroy', () => {
      // this.jQuery('#saveDeviceModal').modal('hide');
      this.Device.ClearListeners('updateDevices');
    });
  }

  SetDeviceInfo() {
    [ this.deviceInfo ] = this.devices.filter((dev) => get(dev, '_id') === this.lastID);
  }

  GetDevices() {
    return this.Device.GetDevices((errorCB, devices) => {
      if (errorCB) {
        window.log.error(`Error obteniendo dispositivos de la base de datos -> ${ errorCB }`);
      } else {
        this.devices = devices;
        this.SetDeviceInfo();
        this.cantidadDisp = this.devices.length;
      }
    });
  }

  SaveDevice(device) {
    try {
      device.Saved = true;
      [ device.Zone ] = this.availableZones.filter((zone) => get(zone, '_id') === device.zoneSelected);
      this.Device.SaveDevice(device, (errorCB, deviceSaved) => {
        const result = errorCB ?
          window.log.error(`No se pudo guardar el dispositivo -> ${ errorCB }`) :
          window.log.success(`Device '${ deviceSaved.Name }' successfully saved`);
        return result;
      });
    } catch (saveError) {
      window.log.error(`Ocurrió un problema guardando el dispositivo -> ${ saveError.stack }`);
    }
  }

  RemoveDevice(id) {
    try {
      this.Device.DeleteDevice(id);
    } catch (removeError) {
      window.log.error(`Ocurrió un problema al eliminar el dispositivo: ${ removeError.stack }`);
    }
  }

  TempDevice(index) {
    this.tmpDevice = this.devices[index];

    this.Zone.GetZones((getError, zones) => {
      const result = getError ?
        window.log.error('Error obteniendo áreas.') :
        this.availableZones = zones;
      return result;
    });
  }

  ChangePin(_id, Pin, val) {
    this.Device.SendMessage('rChangePin',
      {
        _id,
        'pin': Number(Pin),
        'value': val,
        'mode': 'digital',
      }
    );
  }

  /* Mejora. Iniciar los modales desde acá, no en la vista */
  ViewInfoDevice(devID) {
    this.lastID = devID;
    this.SetDeviceInfo();
  }

  ProgramDevice(ip) {
    this.window.open(`http://${ ip }/device`, '_blank');
  }
}

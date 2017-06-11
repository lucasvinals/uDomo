import { service, inject } from 'ng-annotations';

@service('FactoryDevice')
@inject('FactoryMessage', 'FactorySocket', 'FactoryObserver', '$http')
export default class {
  constructor(Message, Socket, Observer, http) {
    this.http = http;
    this.Socket = Socket;
    this.Observer = Observer;
    this.Message = Message;
    this.devices = [];
  }
  /**
   * Subscribe to a particular function with Observer Pattern
   * @param {function} observer
   */
  Subscribe(observer) {
    return this.Observer.Subscribe(observer);
  }
   /**
   * Unubscribe a particular function in the Observer array
   * @param {function} observer
   */
  Unsubscribe(observer) {
    return this.Observer.Unsubscribe(observer);
  }
  /**
   * Get all devices from the server.
   */
  GetDevices() {
    this.http
      .get('/api/device')
      .then((devices) => {
        const { Error: GetDevicesError, Devices } = devices.data;
        if (GetDevicesError) {
          this.Message.error(`Error: ${ JSON.stringify(GetDevicesError) }`);
          throw new Error('GetDevicesError', JSON.stringify(GetDevicesError));
        }
        return Devices;
      })
      .catch((httpDeviceError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        window.log.error(JSON.stringify(httpDeviceError));
      });
  }

  /**
   * Subscribe to devices event to update devices.
   */
  GetDevicesFromSocket() {
    return this.Socket.on('devices', (devices) => devices);
  }

  SaveDevice(device) {
    return this.http.post('/api/device', device)
      .then((response) => {
        const { Error: CreateDeviceError, Device } = response.data;
        if (CreateDeviceError) {
          this.Message.error(`Error: ${ JSON.stringify(CreateDeviceError) }`);
          window.log.error(JSON.stringify(CreateDeviceError));
          throw new Error('CreateDeviceError', JSON.stringify(CreateDeviceError));
        }
        this.Message.success(`El dispositivo ${ Device.Name } fue guardado.`);
        this.Observer.notify();
        return Device;
      })
      .catch((httpError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(httpError));
      });
  }

  DeleteDevice(id) {
    return this.Message
      .confirm(
        'Desea eliminar el dispositivo?',
        Number('10'),
        (response) => {
          if (response) {
            return this.http
              .delete(`/api/device/${ id }`)
              .then((deletedResult) => {
                const { ok, 'n': NumberOfDeletes } = deletedResult.data.Zone;
                if (ok && NumberOfDeletes) {
                  this.Message.success('El dispositivo fue eliminado.');
                  this.Observer.notify();
                }
                return id;
              })
              .catch((httpError) => {
                this.Message.error('Ocurrió un error con la consulta http');
                throw new Error('HTTPRequestError', JSON.stringify(httpError));
              });
          }
          return false;
        }
      );
  }
  ModifyDevice(device) {
    return this.http
      .put('/api/device', device)
      .then((modifyDeviceResponse) => {
        const { Error: ModifyDeviceError, Device } = modifyDeviceResponse.data;
        if (ModifyDeviceError) {
          this.Message.error(`Error: ${ JSON.stringify(ModifyDeviceError) }`);
          throw new Error('ModifyDeviceError', JSON.stringify(ModifyDeviceError));
        }
        return Device;
      })
      .catch((httpError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(httpError));
      });
  }

  ClearListeners(clearInter) {
    this.Observer.UnsubscribeAll();
    this.Socket.Clear('devices');
    window.clearInterval(clearInter);
  }

  SendMessage(listener, message) {
    this.Socket.Emit(listener, message);
  }
/*
  Hacer que:
  * Cuando no está online ni guardado, sacarlo de la lista directamente si previamente
    estuvo en algun estado ->
                  Guardado y luego eliminado: OK.
                  Online y luego Offline: Todavia no lo puedo sacar.
  * Cuando un dispositivo esté guardado pero no en línea, se actualice la variable
    'Online' y se setee en falso para que la vista cambie.

*/

/* var setOfflineDevices = setInterval(() => {
      currentDevices.length != 0 && currentDevices.forEach((device, index) => {
        log.success("Testeando: " + device.lastMessage);
          if((Date.now() - device.lastMessage) > 10000){
            //device.Name = device.Name || '[Dispositivo Online - No Guardado]'
            currentDevices[index].Online = false;
          }
      });
  }, 3000);*/
}

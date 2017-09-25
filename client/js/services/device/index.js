import { service, inject } from 'ng-annotations';

@service('FactoryDevice')
@inject('ResourceDevice', 'FactoryCommon')
export default class {
  constructor(ResourceDevice, Common) {
    this.Device = ResourceDevice;
    this.ProcessResponse = Common.ProcessResponse;
    this.ThrowError = Common.ThrowError;
  }

  GetDevices() {
    return this.Device
      .GetAll()
      .then(this.ProcessResponse)
      .catch(this.ThrowError);
  }

  SaveDevice(device) {
    return this.Device
      .Create(device)
      .then(this.ProcessResponse)
      .catch(this.ThrowError);
  }

  DeleteDevice(id) {
    return this.Device
      .Delete(id)
      .then(this.ProcessResponse)
      .catch(this.ThrowError);
  }

  ModifyDevice(device) {
    return this.Device
      .Modify(device)
      .then(this.ProcessResponse)
      .catch(this.ThrowError);
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

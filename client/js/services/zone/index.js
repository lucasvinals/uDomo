import { service, inject } from 'ng-annotations';

@service('FactoryZone')
@inject('$http', 'FactoryMessage', 'FactorySocket', 'FactoryObserver')
export default class {
  constructor(http, Message, Socket, Observer) {
    this.http = http;
    this.Observer = Observer;
    this.Socket = Socket;
    this.Message = Message;
  }

  clearListeners() {
    this.Observer.UnsubscribeAll();
    this.Socket.clear('Zones/Zone/Read/Response');
    this.Socket.emit('disconnect', {});
  }

  Subscribe(fn) {
    return this.Observer.Subscribe(fn);
  }

  Unsubscribe(fn) {
    return this.Observer.Unsubscribe(fn);
  }

  GetZones() {
    return this.http
      .get('/api/zone')
      .then((zones) => {
        const { Error: GetZonesError, Zones } = zones.data;
        if (GetZonesError) {
          this.Message.error(`Error: ${ JSON.stringify(GetZonesError) }`);
          throw new Error('GetZonesError', JSON.stringify(GetZonesError));
        }
        return Zones;
      })
      .catch((httpError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        window.log.error(httpError);
      });
  }

  CreateZone(zoneToCreate) {
    return this.http.post('/api/zone', zoneToCreate)
      .then((response) => {
        const { Error: CreateZoneError, Zones } = response.data;
        if (CreateZoneError) {
          this.Message.error(`Error: ${ CreateZoneError }`);
          window.log.error(CreateZoneError);
          throw new Error(CreateZoneError);
        }
        this.Message.success(`El área ${ Zones.Name } fue creada.`);
        this.Observer.Notify();
        return Zones;
      })
      .catch((httpError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error(httpError);
      });
  }

  ModifyZone(zone) {
    return this.http
      .put('/api/zone', zone)
      .then((modifyZoneResponse) => {
        const { Error: ModifyZoneError, Zone } = modifyZoneResponse.data;
        if (ModifyZoneError) {
          this.Message.error(`Error: ${ JSON.stringify(ModifyZoneError) }`);
          throw new Error('ModifyZoneError', JSON.stringify(ModifyZoneError));
        }
        return Zone;
      })
      .catch((httpError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error(httpError);
      });
  }

  DeleteZone(zoneId) {
    return this.Message
      .confirm(
        'Desea eliminar el área?',
        Number('10'),
        (response) => {
          if (response) {
            return this.http
              .delete(`/api/zone/${ zoneId }`)
              .then(() => {
                this.Message.success('La zona fue eliminada.');
                this.Observer.Notify();
                return zoneId;
              })
              .catch((httpError) => {
                this.Message.error('Ocurrió un error con la consulta http');
                throw new Error(httpError);
              });
          }
          return false;
        }
      );
  }
}
/* var self = this;
  var requestZones = (function iifeReqZones(){
      /* Emit the event so other users see the current Zones */
      /* Socket.emit('Zones/Zone/Read/Request', {});
      return iifeReqZones;
  })();

  Socket.on('Zones/Zone/Read/Response', function(data){
      var error = data.Error;
      var Zones = data.Zones;
      if(!error){
          return self.GetZones(null, Zones);
      }else{
          Message.error(`Ocurrió un error: ${error}`, 7);
          log(error, 'error');
          self.GetZones(error, null);
      }
  }); */


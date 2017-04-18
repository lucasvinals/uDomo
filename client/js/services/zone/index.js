import Message from '../message';
import Observer from '../patterns/observer';
import Socket from '../socket';

function ZoneFactory($http) {
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
  });*/
  return {
    Subscribe: (fn) => Observer.subscribe(fn),
    Unsubscribe: (fn) => Observer.unsubscribe(fn),
    GetZones: () => $http.get('/api/zone')
      .then((zones) => {
        const zoneError = zones.data.Error;
        if (zoneError) {
          Message.error('Ocurrió un error -> [Descrito en consola]', 10);
          window.log.error(JSON.stringify(zoneError));
          return { Error: zoneError, Zones: [] };
        }
        return { Error: null, Zones: zones.data.Zones };
      })
      .catch((httpZoneError) => {
        Message.error('Ocurrió un error -> [Descrito en consola]', 10);
        window.log.error(JSON.stringify(httpZoneError));
      }),
    // CreateZone: (Zone, callback) => {
    //     $http.post('/Zone', Zone).then(
    //         (res) => {
    //           const err = res.data.Error;
    //           const Zone = res.data.Zones;
    //           if (err) {
    //             Message.warning('Ocurrió un error -> [Descrito en consola]', 10);
    //             window.log.error(JSON.stringify(err));
    //             callback(err, null);
    //           } else {
    //             Message.success(`El área ${Zone.Name} fue creada.`, 10);
    //             Observer.notify();
    //             callback(null, Zone);
    //           }
    //         },
    //         (error) => {
    //             Message.error('Ocurrió un error -> [Descrito en consola]', 10);
    //             window.log.error(JSON.stringify(error));
    //             callback(JSON.stringify(error), null);
    //         });
        
    // },
    // ModifyZone: (Zone, callback) => {
    //     $http.put('/Zone', Zone).then(
    //         (r) => {
    //             var e = r.data.Error;
    //             if(e){
    //                 Message.error('Ocurrió un error modificando el área. Revise la consola', 10);
    //                 window.log.error(JSON.stringify(e));
    //                 callback(JSON.stringify(e), null);
    //             }else{
    //                 Observer.notify();
    //                 callback(null, r.data.Zones);
    //             }
    //         },
    //         (e) => {
    //             Message.error(JSON.stringify(e), 10);
    //             window.log.error(`Ocurrió un error-> ${JSON.stringify(e)}`);
    //         });
    // },
    // DeleteZone: (id) => {
    //   Message.confirm('Desea eliminar el área?', 6, (response) => {
    //     if (response) {
    //       $http
    //         .delete(`/Zone/${ id }`)
    //         .then(
    //           (result) => {
    //             if (_.get(result, 'data.Zones', false)) {
    //               Message.success('El área fue eliminada.', 10);
    //               Observer.notify();
    //             }
    //           },
    //           (deleteError) => {
    //             Message.error(deleteError, 10);
    //             window.log.error(`Ocurrió un error-> ${ deleteError }`);
    //           }
    //         );
    //     }
    //   });
    // },
    clearListeners: () => {
      Observer.unsubscribeAll();
      Socket.clear('Zones/Zone/Read/Response');
      Socket.emit('disconnect', {});
    },
  };
}

export default angular.module('uDomo.Zone').factory('ZoneFactory', [ '$http', ZoneFactory ]);

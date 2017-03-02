let Areas = angular.module('Areas', []);

Areas.factory('Area', ['Socket', '$http', 'Message', 'Observer',
(Socket, $http, Message, Observer) => {
    'use strict';
    /*var self = this;
    var requestAreas = (function iifeReqAreas(){
        /* Emit the event so other users see the current areas */
       /* Socket.emit('Areas/Area/Read/Request', {});
        return iifeReqAreas;
    })();

    Socket.on('Areas/Area/Read/Response', function(data){
        var error = data.Error;
        var areas = data.Areas;
        if(!error){
            return self.GetAreas(null, areas);
        }else{
            Message.error(`Ocurrió un error: ${error}`, 7);
            log(error, 'error');
            self.GetAreas(error, null);
        }
    });*/

    return {
        Subscribe: (fn) => {
            Observer.subscribe(fn);
        },
        Unsubscribe: (fn) => {
           Observer.unsubscribe(fn);
        },
        GetAreas: (callback) => {
            $http.get('/api/Areas').then(
                (r) => {
                    var e = r.data.Error;
                    if(e){
                        Message.error('Ocurrió un error -> [Descrito en consola]', 10);
                        window.log.error(JSON.stringify(e));
                        return callback(e, null);
                    } 
                    callback(null, r.data.Areas);
                },
                (error) => {
                    Message.error('Ocurrió un error -> [Descrito en consola]', 10);
                    window.log.error(JSON.stringify(error));
            });
        },
        CreateArea: (area, callback) => {
            $http.post('/Area', area).then(
                (res) => {
                    var err = res.data.Error;
                    var Area = res.data.Area;
                    if(err){
                        Message.warning('Ocurrió un error -> [Descrito en consola]', 10);
                        window.log.error(JSON.stringify(err));
                        callback(err, null);
                    }else{
                        Message.success(`El área ${Area.Name} fue creada.`, 10);
                        Observer.notify();
                        callback(null, Area);
                    }
                },
                (error) => {
                    Message.error('Ocurrió un error -> [Descrito en consola]', 10);
                    window.log.error(JSON.stringify(error));
                    callback(JSON.stringify(error), null);
                });
            
        },
        ModifyArea: (area, callback) => {
            $http.put('/Area', area).then(
                (r) => {
                    var e = r.data.Error;
                    if(e){
                        Message.error('Ocurrió un error modificando el área. Revise la consola', 10);
                        window.log.error(JSON.stringify(e));
                        callback(JSON.stringify(e), null);
                    }else{
                        Observer.notify();
                        callback(null, r.data.Area);
                    }
                },
                (e) => {
                    Message.error(JSON.stringify(e), 10);
                    window.log.error(`Ocurrió un error-> ${JSON.stringify(e)}`);
                });
        },
        DeleteArea: (id) => {
           Message.confirm('Desea eliminar el área?', 6, (response) => {
                if(response){
                    $http.delete(`/Area/${id}`).then(
                        (data) => {
                            if(data.data.Removed.ok && data.data.Removed.n){
                                Message.success('El área fue eliminada.', 10);
                                Observer.notify();
                            }
                        },
                        (error) => {
                            Message.error(error, 10);
                            window.log.error(`Ocurrió un error-> ${error}`);
                        });
                }
            }); 
        },
        clearListeners: () => {
            Observer.unsubscribeAll();
            Socket.clear('Areas/Area/Read/Response');
            Socket.emit('disconnect', {});
        }
    };
    
}]);
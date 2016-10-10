let Areas = angular.module("Areas", []);

Areas.factory("Area", ["Socket", "$http", "Message",
(Socket, $http, Message) => {
    'use strict';
    /*var self = this;
    var requestAreas = (function iifeReqAreas(){
        /* Emit the event so other users see the current areas */
       /* Socket.emit("Areas/Area/Read/Request", {});
        return iifeReqAreas;
    })();

    Socket.on("Areas/Area/Read/Response", function(data){
        var error = data.Error;
        var areas = data.Areas;
        if(!error){
            return self.GetAreas(null, areas);
        }else{
            Message.error("Ocurrió un error: " + error, 7);
            log(error, 'error');
            self.GetAreas(error, null);
        }
    });*/

    /**
     * Design Pattern: Observer
     */
    class ObserverPattern{
        constructor(){
            this.Observers = [];
        };
        /** 
         * Register an observer (callback function) 
         */
        subscribe(observer){
            this.Observers.push(observer);
        };
        /**
         * Quit an observer (callback function)
         */
        unsubscribe(observer){
            this.Observers = this.Observers.filter((o) => o != observer);
        };
        /**
         * Reset the observers to make a clean exit
         */
        unsubscribeAll(){
            this.Observers = [];
        };
        /**
         * Listener. Call when something changes.. Ex: CRUD operations
         */
        notify(){
            angular.forEach(this.Observers, (observer) => {
              observer();
            });
        };
    };

    let Observer = new ObserverPattern();

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
                    e ? 
                        (
                            Message.error("Ocurrió un error" + e, 10),
                            log.error(e),
                            callback(e, null)
                        ) :
                        callback(null, r.data.Areas);
                },
                (error) => {
                    Message.error("Ocurrió un error -> [Descrito en consola]", 10);
                    log.error(error);
            });
        },
        CreateArea: (area, callback) => {
            $http.post('/Area', area).then(
                (res) => {
                    var err = res.data.Error;
                    var Area = res.data.Area;
                    if(err){
                        Message.warning(err, 10);
                        callback(err, null);
                    }else{
                        Message.success("El área " + Area.Name + " fue creada.", 10);
                        Observer.notify();
                        callback(null, Area);
                    }
                },
                (error) => {
                    Message.error(error, 10);
                    log.error(error);
                    callback("Ocurrió un error creando el área. " + 
                             "puede verlo revisando la consola.", null);
                });
            
        },
        ModifyArea: (area) => {
            $http.put('/Area', area).then(
                (r) => {
                    var e = r.data.Error;
                    e?
                        (
                            Message.error('Ocurrió un error modificando el área. ' + e, 10),
                            callback(e, null)
                        ) :
                        (
                            Observer.notify(),
                            callback(null, r.data.Area)
                        )
                },
                (e) => {
                    Message.error(e, 10);
                    log.error('Ocurrió un error-> ' + e);
                });
        },
        DeleteArea: (id) => {
           Message.confirm("Desea eliminar el área?", 6, (response) => {
                if(response){
                    $http.delete("/Area/" + id).then(
                        (data) => {
                            if(data.data.Removed.ok && data.data.Removed.n){
                                Message.success("El área fue eliminada.", 10);
                                Observer.notify();
                            }
                        },
                        (error) => {
                            Message.error(error, 10);
                            log.error("Ocurrió un error-> " + error);
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
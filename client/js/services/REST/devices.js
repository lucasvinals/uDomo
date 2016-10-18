let Devices = angular.module('Devices', []);

Devices.factory('Device', ['Socket', '$http', 'Message', 'Observer', 
(Socket, $http, Message, Observer) => {
	'use strict';
	let alreadySet = false;
	/* 
		Hacer que:
		* Cuando no está online ni guardado, sacarlo de la lista directamente si previamente
		  estuvo en algun estado -> 
		  							Guardado y luego eliminado: OK.
	  								Online y luego Offline: Todavia no lo puedo sacar.
		* Cuando un dispositivo esté guardado pero no en línea, se actualice la variable 
		  'Online' y se setee en falso para que la vista cambie.

	*/
	
	/*var setOfflineDevices = setInterval(() => {
        currentDevices.length != 0 && currentDevices.forEach((device, index) => {
        	log.success("Testeando: " + device.lastMessage);
            if((Date.now() - device.lastMessage) > 10000){
            	//device.Name = device.Name || '[Dispositivo Online - No Guardado]'
            	currentDevices[index].Online = false;
            }
        });
    }, 3000);*/

	let Facade = {
		Subscribe: (observer) => {
            Observer.subscribe(observer);
        },
        Unsubscribe: (observer) => {
           Observer.unsubscribe(observer);
        },
		getDevices: (callback) => {
			// Socket.on('devices', (devices) => callback(null, devices));

            $http.get('/api/Devices').then(
	            (data) => {
	                var e = data.data.Error;
	                e?
	                    (
	                    	Message.error('Ocurrió un error: ' + e, 10),
	                    	log.error(e),
	                    	callback(error, null)
	                    ) :
	                    callback(null, updateArrayDevices(data.data.Devices));
	            },
	            (error) => {
	                Message.error('Ocurrió un error -> [Descripción en consola]', 10);
	                log.error(JSON.stringify(error));
	            });
		},
		saveDevice: (device, callback) => {
			$http.post('/Device', device).then(
				(data) => {
	                var error = data.data.Error, device = data.data.Device;
	                if(error){
	                	Message.warning(error, 10);
	                    callback(error, null);
	                }else{
	                	Message.success('El dispositivo ' + device.Name + ' fue guardado.', 10);
	                    Observer.notify();
	                    callback(null, device);
	                }
            	}, 
            	(err) => {
	                Message.error('Ocurrió un error guardando el dispositivo' +
	                 				'puede verlo revisando la consola.', 10);
	                log.error(err);
	                callback(JSON.stringify(err), null);
            });
		},
		deleteDevice: (id) => {
			Message.confirm('Desea eliminar el dispositivo?', 5, (response) => {
                if(response){
                    $http.delete('/Device/' + id).then(
                        (data) => {
                        	var res = data.data.Device;
                        	var e 	= data.data.Error;
                        	if(e){
                        		Message.error('Ocurrió un error eliminando el dispositivo. '+
                        					  'Véase en la consola.', 10);
                        		log.error(e);
                        	}else{
                            	res.ok && 
                            	res.n && 
                            	/**
                            		* Ésto fue necesario porque currenDevices (cliente), no se actualiza
                            		* por más que haga el GET a Devices, así que lo remuevo manualmente
                        		*/
                            	_.remove(currentDevices, {'_id': id}) &&
                            	Message.success('El dispositivo fue eliminado.', 10);
                            	Observer.notify();
                        	}
                        },
                        (error) => {
                            Message.error(error, 10);
                            log.error('Ocurrió un error-> ' + error);
                        });
                }
            }); 
		},
		modifyDevice: (callback) => {
			$http.put('/Device', device).then(
				(data) => {
					var e = data.data.Error;
					e?
						(
							Message.error('Ocurrió un error modificando el dispositivo. ' + e, 10),
							callback(e, null)
						) :
						(
							Observer.notify(),
							callback(null, data.data.Device)
						)
				},
				(e) => {
					Message.error(e, 10);
                    log.error('Ocurrió un error-> ' + e);
				});
		},
		clearListeners: (clearInter) => {
			Observer.unsubscribeAll();
			Socket.clear();
        	clearInterval(clearInter);
		},
		sendMessage: (listener, message) => {
			Socket.emit(listener, message);
		},
		/**
		 * To prevent listener attach on every request
		 */
		triggerWithSocketIncomming: () => {
			!alreadySet && Socket.on('devices', (devices) => Facade.getDevices((null, devices))) && (alreadySet = true);
		}
	};

	return Facade;
}]);
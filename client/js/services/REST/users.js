let Users = angular.module('Users', []);

Users.factory('User', ['Socket', '$http', 'Message', 'Observer', 'Storage', 
(Socket, $http, Message, Observer, Storage) => {
    'use strict';

    let changeUser = (user) => { angular.extend(currentUser, user); };

    let urlBase64Decode = (str) => {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    let getUserFromToken = () => {
        let token = Storage.getToken();
        let user = {};
        if (JSON.stringify(token) != 'null') {
            user = JSON.parse(urlBase64Decode(token.split('.')[1]));
        }
        return user;
    }

    let configs = [{"Name": "Lucas"}, {"Name": "Dummy"}];
    let perm = [{"Name": "Luz"}, {"Name": "Dummy2"}];

    var currentUser = getUserFromToken();

    return{
        Subscribe: (observer) => {
            Observer.subscribe(observer);
        },
        Unsubscribe: (callback) =>{
            Observer.unsubscribe(callback);
        },
        GetUsers: (callback) => {
            $http.get('/api/Users').then(
                (res) => {
                    var e = res.data.Error;
                    e ? 
                        (
                            Message.error("Ocurrió un error" + e, 10),
                            log.error(e),
                            callback(e, null)
                        ) :
                        callback(null, res.data.Users);
                },
                (error) => {
                    Message.error("Ocurrió un error -> [Descrito en consola]", 10);
                    log.error(error);
            });
        },
        CreateUser: (userData, callback) => {
            $http.post('/User', userData).then(
				(r) => {
					var e = r.data.Error
                    var u = r.data.User;
					if(e){
                        Message.warning(e, 10);
                        callback(e, null);
					}else{
                        Message.success('El usuario ' + u.Name + ' fue creado.', 10);
                        Observer.notify();
                        callback(null, u);
					}
				},
				(error) => {
                    Message.error(error, 10);
                    callback('Ocurrió un error creando el usuario, ' +
                             'puede verlo revisando la consola.', null);
					log.error(error);
				});
        },
        ModifyUser: (userData, callback) => {
            $http.put('/User', userData).then(
                (r) => {
                    var e = r.data.Error;
                    var u = r.data.User;
                    if(e){
                        Message.warning(e, 10);
                        callback(e, null);
                    }else{
                        Message.success('El usuario ' + u.Name + ' fue modificado.', 10);
                        Observer.notify();
                        callback(null, u);
                    }
                },
                (e) => {
                    Message.error(e, 10);
                    callback('Ocurrió un error modificando el usuario, ' +
                             'puede verlo revisando la consola.', null);
                    log.error(e);
                }
            );
            
        },
        DeleteUser: (id) => {
            Message.confirm('Desea eliminar el usuario?', 5, (response) => {
                if(response){
                    $http.delete('/User/' + id).then(
                        (data) => {
                            var fueRemovido = data.data.User.ok && data.data.User.n;
                            if(fueRemovido){
                                Message.success('El usuario fue eliminado.', 10);
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
        GetPermissions: function(cb){
            return cb(perm, null);
        },
        GetConfigurations: function(cb){
            return cb(configs, null);
        },
        Login : (user, callback) => {
            $http.post('/Authenticate', user).then(
                (r) => {
                    var e = r.data.Error;
                    e ? 
                        (
                            Message.error('Error:' + e, 10),
                            callback(e, null)
                        ) :
                        callback(null, r.data.User);
                }, 
                (e) => {
                    Message.error('Error:' + e, 10);
                    log.error('Ocurrió un error-> ' + e);
                });
        },
        Logout: () => {
            changeUser({});
        },
        clearListeners: () => {
            Observer.unsubscribeAll();
            Socket.cleanExit();
        }
    };
}]);

angular.module('uDomo.Common').factory(
  'BackupFactory',
  [ '$http, Message', ($http, Message) => {
    const log = window.log;

    const Facade = {
      getAll: (getCallback) => {
        $http.get('/api/Backups').then(
          (backups) => {
            const getError = backups.data.Error;
            if (getError) {
              Message.error('Ocurrió un error obteniendo los backups. Revise la consola.');
              log.error(JSON.stringify(getError));
              getCallback(getError, []);
            } else {
              getCallback(null, backups.data.Backups);
            }
          },
          (httpError) => {
            Message.error('Ocurrió un error realizando la consulta. Revise la consola.');
            log.error(JSON.stringify(httpError));
            getCallback(httpError, []);
          }
        );
      },
    };
    return Facade;
  } ]);


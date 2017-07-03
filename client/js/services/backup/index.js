import { service, inject } from 'ng-annotations';

@service('FactoryBackup')
@inject('FactoryMessage', '$http')
export default class {
  constructor(Message, http) {
    this.http = http;
    this.log = window.log;
    this.Message = Message;
  }

  GetAll(getAllCallback) {
    this.http
      .get('/api/Backups')
      .then((backups) => {
        const getError = backups.data.Error;
        if (getError) {
          this.Message.error('Ocurrió un error obteniendo los backups. Revise la consola.');
          this.log.error(JSON.stringify(getError));
          getAllCallback(getError, []);
        } else {
          getAllCallback(null, backups.data.Backups);
        }
      })
      .catch((httpError) => {
        this.Message.error('Ocurrió un error realizando la consulta. Revise la consola.');
        this.log.error(JSON.stringify(httpError));
        getAllCallback(httpError, []);
      });
  }
}

import { inject, service } from 'ng-annotations';

@service('FactoryScene')
@inject('$http')
export default class {
  constructor(http) {
    this.http = http;
  }
}

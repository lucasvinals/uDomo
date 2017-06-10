import { controller, inject } from 'ng-annotations';

@controller('ControllerHome')
@inject('FactoryCommon')
export default class {
  constructor(Common) {
    this.Common = Common;
    window.log.success('Homepage!');
    this.message = 'Homepage!';
  }
}

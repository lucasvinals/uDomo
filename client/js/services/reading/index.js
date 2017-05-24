/* eslint no-magic-numbers:0, no-nested-ternary:0, no-confusing-arrow:0 */
import { service } from 'ng-annotations';

@service('FactoryReadings')
export default class {
  /*@ngInject*/
  constructor() {
  }
  temperatureColor(temperature) {
    this.Temp = temperature < 14 ? 'text-info' :
        (temperature >= 14 && temperature < 25) ? 'text-warning' :
        (temperature > 35) ? 'text-danger' :
        'bold';
    return this.Temp;
  }
  lightType(this, maxIndoor, maxOutdoor) {
    this.maxLight = this.maxLight === maxOutdoor ? maxIndoor : maxOutdoor;
  }
  // percentLight: (light, maxValue) => {
    // var percent = ((light * 100) / maxValue);
    // percent > 100 ? percent =  '100%' : percent += '%';
    // return percent;
  // },
  // clearListener: (name) => {}
}

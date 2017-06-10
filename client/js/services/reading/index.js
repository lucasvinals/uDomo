import { service } from 'ng-annotations';

@service('FactoryReading')
export default class {
  TemperatureColor(temperature) {
    this.result = (temperature < Number('14') && 'text-info') ||
        (temperature >= Number('14') && temperature < Number('25') && 'text-warning') ||
        ((temperature > Number('35')) && 'text-danger') ||
        'bold';
    return this.result;
  }
  lightType(maxIndoor, maxOutdoor) {
    this.maxLight = this.maxLight === maxOutdoor ? maxIndoor : maxOutdoor;
  }
  // percentLight: (light, maxValue) => {
    // var percent = ((light * 100) / maxValue);
    // percent > 100 ? percent =  '100%' : percent += '%';
    // return percent;
  // },
  // clearListener: (name) => {}
}

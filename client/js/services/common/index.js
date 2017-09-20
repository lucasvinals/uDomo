import { service } from 'ng-annotations';

class Log {
  constructor() {
    this.console = window.console;
  }
  'error'(message) {
    this.console.log(`%c${ message }`, 'color:red;font-weight:bold;');
  }
  success(message) {
    this.console.log(`%c${ message }`, 'color:green;font-weight:bold;');
  }
  warning(message) {
    this.console.log(`%c${ message }`, 'color:orange;font-weight:bold;');
  }
  info(message) {
    this.console.log(`%c${ message }`, 'color:blue;font-weight:bold;');
  }
}

@service('FactoryCommon')
export default class {
  constructor() {
    window.log = new Log();
  }
  /**
   * Returns the time since the given date.
   */
  getTimeSince(last) {
    this.msInS = 1000;
    this.secInMin = 60;
    this.minInH = 60;
    this.hInDay = 24;
    this.total = Date.now() - last;
    this.seconds = Math.floor((this.total / this.msInS) % this.secInMin);
    this.minutes = Math.floor((this.total / this.msInS / this.secInMin) % this.minInH);
    this.hours = Math.floor((this.total / (this.msInS * this.secInMin * this.minInH)) % this.hInDay);
    this.days = Math.floor(this.total / (this.msInS * this.secInMin * this.minInH * this.hInDay));

    return {
      total: this.total,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
    };
  }
  /**
   * Create a new string GUID-like
   */
  newID() {
    this.fourChars = () => {
      const HEX = 16;
      const MAXNUM = 0x10000;
      return Math
        .floor((1 + Math.random()) * MAXNUM)
        .toString(HEX)
        .substring(1);
    };

    return [
      this.fourChars(),
      this.fourChars(),
      '-',
      this.fourChars(),
      '-',
      this.fourChars(),
      '-',
      this.fourChars(),
      '-',
      this.fourChars(),
      this.fourChars(),
      this.fourChars(),
    ].join('');
  }
  ThrowError(exception) {
    return new Error(exception);
  }
  ProcessResponse(response) {
    const ResponseFromServer = response.data || response;
    if (ResponseFromServer.Error) {
      throw new Error(JSON.stringify(ResponseFromServer.Error));
    }
    Reflect.deleteProperty(ResponseFromServer, 'Error');
    return ResponseFromServer[Object.keys(ResponseFromServer)[0]];
  }
}

import { service, inject } from 'ng-annotations';

@service('FactoryMessage')
@inject('$timeout')
export default class {
  constructor($timeout) {
    this.timeout = $timeout;
  }

  buildAlert(msg, type, duration) {
    const random = Math.floor(1 + (Math.random() * Number('100000000')));
    const alertContainer = document.getElementById('alertMessage');
    alertContainer.innerHTML += `
      <div
        id="alert_${ random }"
        class="alert alert-${ type } alert-dismissible fade show"
        role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        ${ msg }
      </div>
    `;
    this.timeout(() => {
      const alert = document.getElementById(`alert_${ random }`);
      alertContainer.removeChild(alert);
    }, duration * Number('1000'));
  }
  /**
   * Error message
   * @param {string} message The text message to show. 
   * @param {string} duration Number of seconds to dismiss.
   */
  'error'(message, duration = Number('7')) {
    return this.buildAlert(message, 'danger', duration);
  }
  /**
   * Success message
   * @param {string} message The text message to show. 
   * @param {string} duration Number of seconds to dismiss.
   */
  success(message, duration = Number('7')) {
    return this.buildAlert(message, 'success', duration);
  }
  /**
   * Warning message
   * @param {string} message The text message to show. 
   * @param {string} duration Number of seconds to dismiss.
   */
  warning(message, duration = Number('10')) {
    return this.buildAlert(message, 'warning', duration);
  }
  /**
   * Default message
   * @param {string} message The text message to show. 
   * @param {string} duration Number of seconds to dismiss.
   */
  default(message, duration) {
    this.buildAlert(message, 'default', duration);
  }
}

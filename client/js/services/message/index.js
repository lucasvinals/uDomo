import { service, inject } from 'ng-annotations';

@service('FactoryMessage')
@inject('$timeout')
export default class {
  constructor($timeout) {
    this.timeout = $timeout;
  }

  buildAlert(msg, type, duration) {
    this.element = document.getElementById('alertMessage');
    this.element.innerHTML += `
      <div class="alert alert-${ type } alert-dismissible fade show" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        ${ msg }
      </div>
    `;
    this.timeout(() => (this.element.innerHTML = ''), duration * Number('1000'));
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
   * Confirm prompt
   * @param {string} message The text message to show. 
   * @param {string} duration Number of seconds to dismiss.
   * @param {function} response Result
   */
  confirm(message, duration = Number('10'), response) {
    // return this.Alertify
    //   .confirm(message)
    //   .autoCancel(duration)
    //   .set('movable', true)
    //   .set('closable', true)
    //   .set('title', 'uDomo')
    //   .set('defaultFocus', 'ok')
    //   .set('labels', { ok: 'OK', cancel: 'Cancelar' })
    //   .set('onok', () => response(true));
    this.result = true;
    return this.result;
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

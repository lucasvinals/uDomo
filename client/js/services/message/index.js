import { service } from 'ng-annotations';

@service('FactoryMessage')
export default class {
  constructor() {
    this.Alertify = window.alertify;
  }
  'error'(message, duration = Number('7')) {
    return this.Alertify.notify(message, 'custom_error', duration);
  }
  success(message, duration = Number('7')) {
    return this.Alertify.notify(message, 'custom_success', duration);
  }
  warning(message, duration = Number('10')) {
    return this.Alertify.notify(message, 'custom_warning', duration);
  }
  confirm(message, duration = Number('10'), response) {
    return this.Alertify.confirm(message)
      .autoCancel(duration)
      .set('movable', true)
      .set('closable', true)
      .set('defaultFocus', 'ok')
      .set('labels', { ok: 'OK', cancel: 'Cancelar' })
      .set('onok', () => response(true));
  }
  default(message, duration) {
    return this.Alertify.notify(message, 'default', duration || Number('5'));
  }
}

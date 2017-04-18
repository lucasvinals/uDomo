import Alertify from 'alertifyjs';

function MessageFactory() {
  return {
    'error': (message, duration) => Alertify.notify(message, 'custom_error', duration),
    'success': (message, duration) => Alertify.notify(message, 'custom_success', duration),
    'warning': (message, duration) => Alertify.notify(message, 'custom_warning', duration),
    'confirm': (message, duration, response) =>
      Alertify.confirm(message)
        .autoCancel(duration)
        .set('movable', true)
        .set('closable', true)
        .set('defaultFocus', 'ok')
        .set('labels', { ok: 'OK', cancel: 'Cancelar' })
        .set('onok', () => response(true)),
    'default': (message, duration) => Alertify.notify(message, 'default', duration || Number('5')),
  };
}

export default angular.module('uDomo.Common').factory('MessageFactory', MessageFactory);

let Messages = angular.module("Common");

Messages.factory("Message", [() => {
        'use strict';
        /* type -> 0: success, 1: warning, 2: error */
        var dialog = (type, message, duration, callback) => {
            var result = "";
            switch(type){
                case 0:
                    alertify.notify(message, "custom_success", duration);
                break;
                case 1:
                    alertify.notify(message, "custom_warning", duration);
                break;
                case 2:
                    alertify.notify(message, "custom_error", duration);
                break;
                case 3:
                     alertify.confirm(message)
                         .autoCancel(duration)
                         .set('movable', true)
                         .set('closable', true)
//                         .set("reverseButtons", true)
                         .set("defaultFocus", "ok")
                         .set("labels",{ok : "OK", cancel: "Cancelar"})
                         .set("onok", (closeEvent) => {
                         callback(true);
                     });
                break;
                default:
                    alertify.notify(message, "default", 5);
                break;
            }
            return result;
        };

        return {
            success :   (m, d)      => dialog(0, m, d, null),
            warning :   (m, d)      => dialog(1, m, d, null),
            error   :   (m, d)      => dialog(2, m, d, null),            
            confirm :   (m, d, c)   => dialog(3, m, d, c)
        }
}]);
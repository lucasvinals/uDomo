// var Storage = angular.module('Common');

angular.module('Common').factory('Storage', 
() => {
    'use strict';
    let store = window.localStorage;

    return {
        setToken:       (token) => store.setItem('uDomoToken', token.toString()),
        getToken:       ()      => store.getItem('uDomoToken'),
        deleteToken:    ()      => store.removeItem('uDomoToken')
    };
});
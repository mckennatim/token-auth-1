'use strict';

var app = angular.module("App", [
    'ui.bootstrap',
    'ui.router',
    'Register'
    ]);

app.constant('cfg', {
    serverUrl: 'http://localhost:3000/api/',
    // 'http://parleyvale.com:3000/api/'  'http://sitebuilt.net:3000/api/'
    LSpre: 'reg_',
    afterReg: function(user){
        console.log(user + ' is registered w/token')
    }
})




'use strict';

var app = angular.module("App", [
    'ui.bootstrap',
    'ui.router',
    'Register'
    ]);

app.constant('cfg', {
    setup: function(){
        var port = 3002;
        var url = 'http://localhost:'+port+'/api/';
        var prefix = 'reg_';
        var toState = 'lists'
        return {
            port: port,
            url: url,
            prefix: prefix,
            toState: toState
        }
    },
    afterReg: function(user){
        console.log(user + ' is registered w/token')
    }
})

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
    $stateProvider.state('splash',{
        url:'/',
        template: '<h4>Splash</h4>'
    });
    $stateProvider.state('lists',{
        url:'/lists',
        template: '<h4>Lists</h4>'
    });
    $urlRouterProvider.otherwise('/');    
}])

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('OnlineInterceptor');
});



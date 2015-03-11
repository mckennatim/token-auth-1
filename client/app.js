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

app.run(function($window, $rootScope){
  $rootScope.online=false;
  $rootScope.status=0;
})

app.factory('OnlineInterceptor', function($rootScope, $q){
        var Interceptor ={
            responseError: function(response){
                console.log(response)
                $rootScope.status = response.status;
                $rootScope.online = false;
                return $q.when(response);
            },
            response: function(response){
                console.log(response.status)
                if (response.config.url.substring(0,8)=='partials'){//hack
                    $rootScope.status = response.status;
                    $rootScope.online = false;                    
                }else{
                    $rootScope.status = response.status;
                    $rootScope.online = true;                    
                }
                console.log(response.config.url)
                //console.log('inter resp '+$rootScope.online+ response.status)
                return $q.when(response);           
            }
        };
        return Interceptor;
})


'use strict';

var app = angular.module("App", [
    'ui.bootstrap',
    'ui.router',
    'Register'
    ]);

app.constant('cfg', {
    serverUrl: 'http://localhost:3004/api/',
    // 'http://parleyvale.com:3000/api/'  'http://sitebuilt.net:3000/api/'
    LSpre: 'reg_',
    afterReg: function(user){
        console.log(user + ' is registered w/token')
    }
})

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


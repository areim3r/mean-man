angular.module('mean-manager')
    .factory('auth', function($http, $cookieStore){
        var auth = {};
        
        auth.local = function(user){
            $http.post('/auth/local', user).
                success(function(data, status, headers, config) {
                    window.location.href = '/';
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status);
                });
        }
        
        auth.logout = function(){
            $http.get('/logout').
                success(function(data, status, headers, config) {
                    $cookieStore.remove('user');
                    location.reload();
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status);
                });   
        }
        
        
        return auth;
    });
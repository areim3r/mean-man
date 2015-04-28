angular.module('mean-manager')
    .factory("mixedSocial", function($http) {
        var mixedSocial = {};
        mixedSocial.get = function(callback){
            $http.get('/social')
                    .success(function(data, status, headers, config){
                        callback(data);
                    })
                    .error(function(data, status, headers, config){
                        console.log(status);
                    });  
        };
        return mixedSocial;
    });
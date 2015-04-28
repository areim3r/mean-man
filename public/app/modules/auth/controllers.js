angular.module('mean-manager')
.controller('auth', ['$scope', '$http', 'auth', function($scope, $http, auth){
        $scope.localAuth = function(){
            auth.local($scope.user);
        }
}])
.controller('login', ['$scope', '$http', function($scope, $http){
        $scope.authProv = function(provider){
            window.location.href = '/auth/'+provider;
        }
}])
.controller('logout', ['$scope', '$http', '$cookieStore', 'auth', function($scope, $http, $cookieStore, auth){
        $scope.logout = function(){
            auth.logout();
        }
}])
.controller('authorize', ['$scope', '$http', function($scope, $http){
        $scope.authorize = function(provider){
            window.location='/auth/'+provider;
        }
}]);
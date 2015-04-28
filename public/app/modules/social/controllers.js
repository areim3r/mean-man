angular.module('mean-manager')
    .controller('SocialFeed', ['$scope', '$http', '$cookieStore', 'mixedSocial', function($scope, $http, $cookieStore, mixedSocial){
        
        var isLoggedIn = $cookieStore.get('user');
        
        if(isLoggedIn){
            mixedSocial.get(function(data){
                $scope.tweets = data.tweets;
                $scope.grams = data.grams;
            });
        }
        
}]);
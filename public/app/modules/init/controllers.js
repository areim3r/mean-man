angular.module('mean-manager')
    .controller('init', ['$scope', '$cookieStore', function($scope, $cookieStore){
        
        angular.element(document).ready(function(){
            $scope.session_user = JSON.parse(JSON.stringify(user));
            
            $cookieStore.put('user', $scope.session_user);
            
            var curr_user = $cookieStore.get('user');
            
            $scope.user_img = curr_user.profile_img;
            
        });
        
}]);
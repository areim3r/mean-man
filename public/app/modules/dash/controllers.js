angular.module('mean-manager')
    .controller('dash', ['$scope', '$http', 'flash', '$cookieStore', function($scope, $http, flash, $cookieStore){

    	if($cookieStore.get('user')){
            var curr_user = $cookieStore.get('user');
    		$scope.username = curr_user.mm_username;
    		flash.success = 'Welcome, '+curr_user.mm_username+'! You have successfully logged in.'
    	}
}]);
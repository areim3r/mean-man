angular.module('mean-manager')
    .config(['$routeProvider', '$locationProvider', 'flashProvider', function($routeProvider, $locationProvider, flashProvider) {
      $routeProvider
      .when('/', {
        templateUrl: 'app/views/dash.html',
        controller: 'dash'
      })
      .when('/auth/:provider', {
        controller: 'facebook'  
      })
      .when('/social-feed', {
        templateUrl: 'app/views/socialFeed.html',
        controller: 'SocialFeed' 
      })
      .when('/friends', {
        templateUrl: 'app/views/friends.html'
      })
      .when('/signup', {
        templateUrl: 'app/views/signup.html'  
      })
      .when('/settings', {
        templateUrl: 'app/views/settings.html'  
      })
      .when('/login', {
        templateUrl: 'app/views/login.html',
        controller: 'login'  
      })
      .when('/logout', {
        controller: 'logout'
      });
    // use the HTML5 History API
        $locationProvider.html5Mode(true);    

      // Support bootstrap 3.0 "alert-danger" class with error flash types
      flashProvider.errorClassnames.push('alert-danger');

      /**
       * Also have...
       *
       * flashProvider.warnClassnames
       * flashProvider.infoClassnames
       * flashProvider.successClassnames
       */

}]);
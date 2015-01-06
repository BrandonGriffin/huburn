(function() {

  angular.module('huburn')
    .config(['$routeProvider', '$httpProvider',
      function($routeProvider, $httpProvider) {
        $routeProvider
          .when('/burndown/:repo*', {
            templateUrl: 'partials/burndown.html',
            controller: 'burndownCtrl'
          })
          .when('/availability/:repo*', {
            templateUrl: 'partials/availability.html',
            controller: 'availabilityCtrl'
          })
          .when('/repositories', {
            templateUrl: 'partials/repositories.html',
            controller: 'repositoriesCtrl'
          })
          .otherwise({
            redirectTo: '/repositories'
          });
      }
    ]);

}());
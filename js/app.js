var agriApp = angular.module('agriApp', [
  'agri.config',
  'agriControllers',
  'ngRoute',
  'leaflet-directive',
  'agriServices'
]);

agriApp.run(['$rootScope', '$injector', 'sessionService', function($rootScope, $injector, sessionService) {
    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
      if (sessionService.isLogged()) {

        console.log("Bearer " + sessionService.getAccessToken());

        headersGetter()['Authorization'] = "Bearer " + sessionService.getAccessToken();
      }
      if (data) {
        return angular.toJson(data);
      }
    };
}]);

agriApp.config(['$routeProvider',
  function($routeProvider) {
      $routeProvider
      .when('/index', {
        templateUrl: 'js/partials/index.html',
        controller: 'IndexCtrl'
      })
      .when('/login', {
        templateUrl: 'js/partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/logout', {
        templateUrl: 'js/partials/logout.html',
        controller: 'LogoutCtrl'
      })
      .when('/register', {
        templateUrl: 'js/partials/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/plot/:plot_id', {
        templateUrl: 'js/partials/plot.html',
        controller: 'PlotCtrl'
      })
      .otherwise({
        redirectTo: '/index'
      });
  }]);

var agriApp = angular.module('agriApp', [
  'agri.config',
  'agriControllers',
  'ngRoute',
  'leaflet-directive',
]);

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

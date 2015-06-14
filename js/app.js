'use strict'

var agriApp = angular.module('agriApp', [
  'agri.config',
  'agriControllers',
  'agriServices',
  'ngRoute',
  'leaflet-directive',
  'restangular',
  'ui.bootstrap'
]);

agriApp.run(['$rootScope', '$injector', 'sessionService', function($rootScope, $injector, sessionService) {
    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
      if (sessionService.isLogged()) {
        console.log('Bearer '  + sessionService.getAccessToken())
        headersGetter()['Authorization'] = "Bearer " + sessionService.getAccessToken();
        headersGetter()['Content-Type'] = "application/json";
      }
      if (data) {
        return angular.toJson(data);
      }
    };
}]);

agriApp.config(['RestangularProvider', 'API_BASE_URL', function (RestangularProvider, API_BASE_URL) {
  // The URL of the API endpoint
  RestangularProvider.setBaseUrl(API_BASE_URL);

  // JSON-LD @id support
  RestangularProvider.setRestangularFields({
      id: '@id'
  });
  // Hydra collections support
  RestangularProvider.addResponseInterceptor(function (data, operation) {
      // Remove trailing slash to make Restangular working
      function populateHref(data) {
          if (data['@id']) {
              data.href = data['@id'].substring(1);
          }
      }

      // Populate href property for the collection
      populateHref(data);

      if ('getList' === operation) {
          var collectionResponse = data['hydra:member'];
          collectionResponse.metadata = {};

          // Put metadata in a property of the collection
          angular.forEach(data, function (value, key) {
              if ('hydra:member' !== key) {
                  collectionResponse.metadata[key] = value;
              }
          });

          // Populate href property for all elements of the collection
          angular.forEach(collectionResponse, function (value) {
              populateHref(value);
          });

          return collectionResponse;
      }

      return data;
  });

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

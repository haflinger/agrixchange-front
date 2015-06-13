var agriControllers = angular.module('agriControllers', ['agriServices']);

// Index Controller
agriControllers.controller('IndexCtrl', ['$scope', '$http', '$modal','leafletData', 'Plot', 'Restangular', 'sessionService', 'API_BASE_URL', function ( $scope, $http, $modal, leafletData, Plot, Restangular, sessionService, API_BASE_URL ) {

  // LEAFLET MAP DRAW

  leafletData.getMap().then(function(map) {

    // Loading Plots
    var plots = Restangular.all('plots');

    // TEST
    plots.getList().then(function(plots) {
      $scope.plots = plots;
    });


    //
    $scope.savePlot = function() {

      var savePlotModalInstance = $modal.open({
        animation: true,
        templateUrl: 'js/partials/modals/savePlot.html',
        controller: 'SavePlotModalCtrl',
        size: 'lg',
        resolve: {
          plot: function () {
            return $scope.plot;
          }
        }
      });

      savePlotModalInstance.result.then(function (plot) {
        $scope.plot = plot;
      }, function () {
        console.log('Annulation');
      });
    }


    var drawnItems = new L.featureGroup().addTo(map);

    map.setView([48.470294, 1.015184], 13);

    var osm = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZomm: 8,
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    });

    var cadastre = new L.tileLayer('http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: 'Cadastre',
    });

    map.addLayer(osm);
    map.addLayer(cadastre);

    map.addControl(new L.Control.Draw({
      draw : {
        polyline : false,
        circle: false,
        marker: false
      },
      edit: {featureGroup: drawnItems }
    }));

    map.on('draw:created', function (event) {

      console.log(event);
      $scope.plot = event;
      $scope.savePlot();

      var layer = event.layer;
      drawnItems.addLayer(layer);


        // console.log(JSON.stringify(layer.toGeoJSON()));
    });
  });

  // LEAFLET MAP LAYERS

  $scope.mapLayers = {
    osm : {
      name  : 'OSM',
      url   : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      type  : 'xyz'
    },
    cadastre : {
      name  : 'Cadastre',
      url   : 'http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png',
      type  : 'xyz'
    }
  };

}]);

// PLOT Controller
agriControllers.controller('PlotCtrl', ['$scope', function ( $scope ) {

}]);

// SAVE PLOT MODAL Controller
agriControllers.controller('SavePlotModalCtrl', ['$scope', '$modalInstance', 'plot', function($scope, $modalInstance, plot){

  $scope.plot = plot;

  $scope.submit = function () {
    if($scope.plot.name.length >= 1) {
      $modalInstance.close($scope.plot);
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);

// LOGIN Controller
agriControllers.controller('LoginCtrl', ['$scope', '$http', '$location', 'sessionService', 'API_AUTH_URL', 'API_BASE_URL', function ( $scope, $http, $location, sessionService, API_AUTH_URL, API_BASE_URL ) {

  if(sessionService.isLogged()) {
    $location.path('/index');
  }

  $scope.username = '';
  $scope.password = '';

  $scope.login = function() {
    $http.get(API_AUTH_URL
      + "oauth/v2/token?grant_type=password&username="
      + $scope.username
      + "&password="
      + $scope.password
      + "&client_id=2_2ih5z6oswj0gwc80gw0scg4s0cg44880sc0sw84gsowcs8o00w&client_secret=lbim1q5buhw00o84gog4k8oo8gw84w4wkgwgggsoko0s0k48c").success(function(data){
      if(data.access_token) {

        sessionService.setAccessToken(data.access_token);
        console.log(data.access_token);
        $http.get(API_BASE_URL + 'users/me').success(function(data){
          sessionService.setUser(data);
          $location.path('/index');
        })
      } else {
        $location.path('/login');
      }


    });
  }
}]);

agriControllers.controller('LogoutCtrl', ['sessionService', '$location', function ( sessionService , $location ) {
  sessionService.destroy();
  $location.path('/login');
}]);


agriControllers.controller('NavBarCtrl', ['$scope', '$http', 'sessionService', 'API_AUTH_URL', function ($scope, $http, sessionService, API_AUTH_URL ) {
  $scope.logged = sessionService.isLogged();
}]);

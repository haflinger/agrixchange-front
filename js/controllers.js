var agriControllers = angular.module('agriControllers', ['agriServices']);

// Index Controller
agriControllers.controller('IndexCtrl', ['$scope', 'leafletData', function ( $scope, leafletData ) {

  // LEAFLET MAP DRAW

  leafletData.getMap().then(function(map) {

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

        var layer = event.layer;
        drawnItems.addLayer(layer);
        console.log(JSON.stringify(layer.toGeoJSON()));
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

// LOGIN Controller
agriControllers.controller('LoginCtrl', ['$scope', '$http', '$location', 'sessionService', 'API_AUTH_URL', 'API_BASE_URL', function ( $scope, $http, $location, sessionService, API_AUTH_URL, API_BASE_URL ) {

  $scope.username = '';
  $scope.password = '';

  $scope.login = function() {
    $http.get(API_AUTH_URL
      + "oauth/v2/token?grant_type=password&username="
      + $scope.username
      + "&password="
      + $scope.password
      + "&client_id=2_2ih5z6oswj0gwc80gw0scg4s0cg44880sc0sw84gsowcs8o00w&client_secret=lbim1q5buhw00o84gog4k8oo8gw84w4wkgwgggsoko0s0k48c").success(function(data, status){
      if(data.access_token) {
        sessionService.setAccessToken(data.access_token);
        sessionService.setUser(data.access_token);
        $location.path('/index');
      } else {
        $location.path('/login');
      }
    });
  }
}]);

agriControllers.controller('LogoutCtrl', ['$scope', '$location', 'sessionService', function ( $scope, $location, sessionService ) {
  sessionService.destroy()
  $location.path('/login');
}]);


agriControllers.controller('NavBarCtrl', ['$scope', '$http', 'sessionService', 'API_AUTH_URL', 'API_BASE_URL', function ( $scope, $http, sessionService, API_AUTH_URL ) {
  $scope.logged = sessionService.isLogged()
  $scope.user   = sessionService.getUser()
}]);

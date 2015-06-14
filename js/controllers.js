var agriControllers = angular.module('agriControllers', ['agriServices']);
//****************************************** CONTROLLERS VIEW***************************************
// Index Controller
agriControllers.controller('IndexCtrl', ['$scope', '$location', '$http', '$modal','leafletData', 'Plot', 'Restangular', 'sessionService', 'API_BASE_URL', function ( $scope, $location, $http, $modal, leafletData, Plot, Restangular, sessionService, API_BASE_URL ) {


  // Redirect to plot
  $scope.details = function (plot) {
    console.log(plot['id']);
    $location.path('/plot/' + plot['@id'].split("=").pop());
  };

  // Loading Plots
  $scope.plots = Restangular.all('plots');

  $scope.plots.getList().then(function(plots) {
    $scope.plots = plots;
  });

  // Map drawing
  leafletData.getMap().then(function(map) {

    var drawnItems = new L.featureGroup().addTo(map);

      $scope.$watch('plots', function(oldValue, newValue){
        if(oldValue != newValue) {
          var plotsToMap = [];
          $scope.plots.forEach(function(plot){

            drawnItems.addLayer(L.geoJson({
              "type": "Feature",
              "target" : {
                "editing" : true
              },
              "properties": {"plot_name": plot.name},
              "geometry": {
                  "type": "Polygon",
                  "coordinates" : [plot.geojson]
                }
            }));

          })

          map.fitBounds(drawnItems, { animated : true });

        }
      });

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
        marker: false,
        polygon: {
          showArea : true,
          allowIntersection: true,
        }
      },
      edit: {featureGroup: drawnItems }
    }));

    map.on('draw:created', function (e) {

      var type = e.layerType
      var layer = e.layer;

      if (type === 'polygon') {
        $scope.area = L.GeometryUtil.geodesicArea(layer.getLatLngs());
      }

      //DECLARATION Variable
      $scope.name = '';

      //++++++++++++++ BEGIN MODAL INSTANCE ++++++++++++++//
      var savePlotModalInstance = $modal.open({
        animation: true,
        templateUrl: 'js/partials/modals/savePlot.html',
        controller: 'SavePlotModalCtrl',
        size: 'sm',
        resolve: {
          name: function () {
            return $scope.name;
          }
        }
      });

      savePlotModalInstance.result.then(function (name) {
        $scope.name = name;
        $scope.plots.post({ name : $scope.name, geojson : layer.toGeoJSON().geometry.coordinates[0], area : $scope.area }).then(function(response){
          drawnItems.addLayer(layer);
          $scope.plots.getList().then(function(plots) {
            $scope.plots = plots;
          });
        }, function(e){
          console.log(e);
        });


      }, function () {
        console.log('Annulation');
      });
      //++++++++++++++ END MODAL INSTANCE ++++++++++++++//

    });
  });

}]);

// PLOT Controller
agriControllers.controller('PlotCtrl', ['$scope', '$routeParams', 'Restangular', 'leafletData', function ( $scope, $routeParams, Restangular, leafletData ) {

  // Loading Plots
  Restangular.one('plots', $routeParams.plot_id).get().then(function(plot){
    $scope.plot = plot;
  });

  // Map drawing
  leafletData.getMap().then(function(map) {

  var getPolygonCenter = function (arr) {
    return arr.reduce(function (x,y) {
        return [x[0] + y[0]/arr.length, x[1] + y[1]/arr.length]
    }, [0,0])
  }


  $scope.$watch('plot', function(oldValue, newValue){
    if(oldValue != newValue) {

      var layer = L.geoJson({
        "type": "Feature",
        "target" : {
          "editing" : true
        },
        "properties": {"plot_name": $scope.plot.name},
        "geometry": {
            "type": "Polygon",
            "coordinates" : [$scope.plot.geojson]
          }
      })

      map.addLayer(layer);

      map.setView(getPolygonCenter($scope.plot.geojson))
      map.fitBounds(layer, { animated : true });

    }
  });



  var osm = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 8,
      attribution: 'OpenStreetMap',
  });

  var cadastre = new L.tileLayer('http://tms.cadastre.openstreetmap.fr/*/transp/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: 'Cadastre',
  });

  map.addLayer(osm);
  map.addLayer(cadastre);

  });

  //Save WORK IN PLOT

  $scope.saveWork = function() {

    //DECLARATION Variable
    $scope.name="";
    $scope.typework_id ="";

    $scope.showModal = true;
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    // Loading Typework GetList
    Restangular.all('typeworks').getList().then(function(typeworks){
      $scope.typeworks = typeworks;

      $scope.itemsTypework = [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
        { id: 3, name: 'blah' }
      ];

      console.log($scope.typeworks);
    });


    //++++++++++++++ BEGIN MODAL INSTANCE ++++++++++++++//
    var saveWorkModalInstance = $modal.open({
      animation: true,
      templateUrl: 'js/partials/modals/saveWork.html',
      controller: 'SaveWorkModalCtrl',
      size: 'sm',
      resolve: {
        name: function () {
          return $scope.name;
        },
        typework_id: function () {
          return $scope.typework_id;
        }
      }
    });

    saveWorkModalInstance.result.then(function (name,typework_id) {
      $scope.name = name;
      $scope.typework_id = typework_id;
      $scope.works.post({ name : $scope.name, typework_id : $scope.typework_id }).then(function(response){
        console.log(response);
      }, function(e){
        console.log(e);
      });


    }, function () {
      console.log('Annulation');
    });
    //++++++++++++++ END MODAL INSTANCE ++++++++++++++//




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

//Logout Controller
agriControllers.controller('LogoutCtrl', ['sessionService', '$location', function ( sessionService , $location ) {
  sessionService.destroy();
  $location.path('/login');
}]);

//NavBar Controller
agriControllers.controller('NavBarCtrl', ['$scope', '$http', 'sessionService', 'API_AUTH_URL', function ($scope, $http, sessionService, API_AUTH_URL ) {
  $scope.logged = sessionService.isLogged();
}]);
//****************************************** CONTROLLERS MODAL***************************************
// SAVE PLOT MODAL Controller
agriControllers.controller('SavePlotModalCtrl', ['$scope', '$modalInstance', 'name', function($scope, $modalInstance, name){

  $scope.name = name;

  $scope.submit = function () {
    if($scope.name.length >= 1) {
      $modalInstance.close($scope.name);
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);

// SAVE Work MODAL Controller
agriControllers.controller('SaveWorkModalCtrl', ['$scope', '$modalInstance', 'name', 'typework_id', function($scope, $modalInstance, name, typework_id){

  $scope.name = name;
  $scope.typework_id = typework_id;

  $scope.submit = function () {
    if($scope.name.length >= 1) {
      $modalInstance.close($scope.name,$scope.typework_id);
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
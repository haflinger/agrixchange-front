var agriControllers = angular.module('agriControllers', []);

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

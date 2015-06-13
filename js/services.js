'use strict';

var agriServices = angular.module('agriServices', ['ngResource']);

agriServices.factory('User',
            ['$resource', 'API_BASE_URL',
    function( $resource ,  API_BASE_URL ) {

    return $resource(API_BASE_URL+'users/:user_id', {}, {
      list: { method: 'GET', isArray: true },
      read: { method: 'GET' }
    });
  }])

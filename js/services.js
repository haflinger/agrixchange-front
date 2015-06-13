'use strict';

var agriServices = angular.module('agriServices', ['ngResource', 'ngStorage']);

agriServices.factory('User',
            ['$resource', 'API_BASE_URL',
    function( $resource ,  API_BASE_URL ) {

    return $resource(API_BASE_URL+'users/:user_id', {}, {
      list: { method: 'GET', isArray: true },
      read: { method: 'GET' }
    });
  }]);

  agriServices.factory('sessionService', [ '$log', '$localStorage',
      function ($log, $localStorage) {
    // Instantiate data when service
        // is loaded
        if ($localStorage.session ) {
          this._user = $localStorage.session.user;
        }

        if ($localStorage.session) {
          this._accessToken = $localStorage.session.accessToken;
        }

        this.getUser = function(){
          return this._user;
        };

        this.setUser = function(user){
          this._user = user;
          $localStorage.session = {
            user : JSON.stringify(user)
          }
          return this;
        };

        this.getAccessToken = function(){
          return this._accessToken;
        };

        this.setAccessToken = function(token){
          this._accessToken = token;
          $localStorage.session = {
            accessToken : token
          }
          return this;
        };

        this.isLogged = function(){
          if(this._accessToken) {
            console.log('Connecté');
            return true;
          } else {
            console.log('Non Connecté')
            return false;
          }
        }

        /**
         * Destroy session
         */
        this.destroy = function destroy(){
          this.setUser(null);
          this.setAccessToken(null);
        };

        return this;
  }]);

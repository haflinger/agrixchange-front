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

  agriServices.factory('sessionService', [ '$http', '$log', '$localStorage', 'API_BASE_URL',
      function ($http, $log, $localStorage, API_BASE_URL) {
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

        this.setUser = function(){

          if(typeof(this._access_token) != 'undefined') {

            $http.get(API_BASE_URL + 'users/me?access_token='+ this._access_token ).success(function(data){
              this._user = data;
            });

            $localStorage.session = {
              user : this._user
            }

          };


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
          this.setUser();
          return this;
        };

        this.isLogged = function(){
          if(this._accessToken) {
            return true;
          } else {
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

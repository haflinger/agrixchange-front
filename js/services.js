

var agriServices = angular.module('agriServices', ['ngResource', 'ngStorage']);

agriServices.factory('Plot',
            ['$resource', 'API_BASE_URL',
    function( $resource ,  API_BASE_URL ) {

    return $resource(API_BASE_URL+'plots/:user', {}, {
      list: { method: 'GET', isArray: true },
      read: { method: 'GET' },
      new : { method: 'POST' },
    });
}]);

agriServices.factory('sessionService', [ '$log', '$localStorage',
    function ($log, $localStorage) {

    // Instantiate data when service
        // is loaded
          this._user        = $localStorage.user;
          this._accessToken = $localStorage.token;

        this.getUser = function(){
          return this._user;
        };

        this.setUser = function(user){
          this._user = user;
          $localStorage.user = user;
          return this;
        };

        this.getAccessToken = function(){
          return this._accessToken;
        };

        this.setAccessToken = function(token){
          console.log(token);
          this._accessToken = token;
          $localStorage.token = token;
          return this;
        };

        this.isLogged = function(){
          if(this._accessToken) {
            console.log('online');
            return true;
          } else {
            console.log('offline');
            return false;
          }
        };

        this.destroy = function destroy(){
          console.log('Destroy Session')
          this.setUser(null);
          this.setAccessToken(null);
        };

        return this;
  }]);



var agriServices = angular.module('agriServices', ['ngResource', 'ngCookies']);

agriServices.factory('User',
            ['$resource', 'API_BASE_URL',
    function( $resource ,  API_BASE_URL ) {

    return $resource(API_BASE_URL+'users/:user_id', {}, {
      list: { method: 'GET', isArray: true },
      read: { method: 'GET' }
    });
}]);

agriServices.factory('sessionService', [ '$log',
    function ($log) {
    // Instantiate data when service
        // is loaded
          //this._user        = $cookieStore.get('user');
          //this._accessToken = $cookieStore.get('token');

        this.getUser = function(){
          return this._user;
        };

        this.setUser = function(user){
          this._user = user;
          //$cookieStore.put('user', user);
          return this;
        };

        this.getAccessToken = function(){
          return this._accessToken;
        };

        this.setAccessToken = function(token){
          console.log(token);
          this._accessToken = token;
          //$cookieStore.put('token', token);
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

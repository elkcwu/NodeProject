/**
 * http://usejsdoc.org/
 */

/* The Factory recipe constructs a new service using a function with zero or more arguments */
angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken){
	var authFactory = {};
	
	authFactory.login = function(username, password){
		
		return $http.post('/api/login', {
			username: username,
			passwoard: password
		})
		.success(function(data){ //promise function, data is promise object
			AuthToken.setToken(data.token);
			return data;
		}) 
	}
	
	authFactory.logout = function(){
		AuthToken.setToken();
	}
	
	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken())
			return true;
		else
			return false;
	}
	
	authFactory.getUser = function(){
		if(AuthToken.getToken())
	}
})
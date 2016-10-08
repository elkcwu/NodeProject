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
			return $http.get('/api/me');
		else
			return $q.reject({ message: " User has not token"});
	}
	
	return authFactory;  // return for future use
	
})  //no ; for chaining



.factory('AuthToken', function($window){  //window is the way to get token from the browser
	var authTokenFactory = {};
	
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}
	
	authTokenFactory.setToken = function(token){
		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	}
	
	return authTokenFactory;  // return for future use
	
})//no ; for chaining


.factory('AuthInterceptor', function($q, $location, AuthToken){  //$q service provide Promises
	
	var interceptorFactory = {};
	
	interceptorFactory.request = function(config){
		var token = AuthToken.getToken();
		if(token){
			config.headers['x-token-header'] = token;
		}
		
		return config;
	};
	
	interceptorFactory.responseError = function(response){
		if(response.status == 403)
			$location.path('/api/login')
	}
})



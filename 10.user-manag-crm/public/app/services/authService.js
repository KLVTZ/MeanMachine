angular.module('authService', [])

// ==================================
// auth factory to login and get info
// $http for communication with API
// $q to return promise objects
// AuthToken to manage tokens
.factory('Auth', function($http, $q, AuthToken) {
	// create the auth factory
	var authFactory = {};

	// log a user in
	authFactory.login = function(username, password) {
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
		.success(function(data) {
			AuthToken.setToken(data.token);
		});
	};
	// log a user out by clearing the token
	authFactory.logout = function() {
		// clear the token
		AuthToken.setToken();
	};

	// check if a user is logged in
	// check if there is a local token
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken())
			return true;
		else
			return false;
	};

	// get the logged in user
	authFactory.getUser = function() {
		if(AuthToken.getToken())
			return $http.get('/api/me', { cache: true });
		else
			return $q.reject({message: 'User has no token.'}); 
	}
	
	// return the auth factory object
	return authFactroy;
})

// =========================================
// factory for handling tokens
// inject $window to store token client-side
// =========================================
.factory('AuthToken', function($window) {
	var authTokenFactory = {};

	// get the token out of local storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};
	
	// set the token or clear the token
	// if a token is passed, set the token
	// if there is no token, clear it from local storage
	authTokenFactory.setToken = function(token) {
		if (token)
			$window.localStorage.setItem('token', token)
		else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;
})
// =========================================
// application configuration to integrate token into requests
// =========================================
.factory('AuthInterceptor', function($q, $location, AuthToken) {
	var interceptorFactory = {};

	// this will happen on all HTTP requests
	interceptorFactory.request = function(config) {
		// grab the token
		var token = AuthToken.getToken();

		// if the token exists, add it to the header as x-access 
		if (token) 
			config.headers['x-access-token'] = token;

		return config;
			
	};

	// happens on response errors
	interceptorFactory.responseError = function(response) {
		// if our server returns a 403 forbidden response
		if (response.status = 403)
			$location.path('/login');

		// return the errors from the server as a promise
		return $q.reject(response);
	};
	// attach the token to every request
	// redirect if a token doesn't authenticate
	return interceptorFactory;
})

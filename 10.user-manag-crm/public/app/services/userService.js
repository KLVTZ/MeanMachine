angular.module('userService', [])

.factory('User', function($http) {
	
	// creare a new object
	var userFactory = {}

	userFactory.get = function(id) {
		return $http.get('/api/users/' + id);
	};

	// get all users
	userFactory.all = function(userData) {
		return $http.get('/api/users/');
	};

	// update a user
	userFactory.update = function(id, userData) {
		return $http.post('/api/users/' + id, userData);
	};

	// delete a user
	userFactory.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};

	return userFactory;

});

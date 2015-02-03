angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {
	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
	});

	// get user information after logging in
	Auth.getUser()
		.then(function(data) {
			vm.user = data.data;
		});

	vm.doLogin = function() {
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				Auth.getUser()
					.then(function(data) {
						vm.user = data.data;
					});

				// if a user successfully logs in, redirect to users page
				$location.path('/users');
			});
	};

	vm.doLogout = function() {
		Auth.logout();
		$location.path('/');
	};
});

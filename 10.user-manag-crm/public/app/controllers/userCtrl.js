// start our angular module and inject userService
angular.module('userCtrl', ['userService'])

// user controller for the main page
// inject the User factroy
.controller('userController', function(User) {
	var vm = this;

	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {
			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;
		});
})

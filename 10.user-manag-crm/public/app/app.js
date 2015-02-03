angular.module('userApp', [
		'ngAnimate',
		'appRoutes',
		'authService',
		'mainCtrl',
		'userCtrl',
		'userService'
]);

.controller('userController', function(Stuff) {
	var vm = this;

	// get all the stuff
	Stuff.all()
		.success(function() {
			// bind the data to a controller variable
			// this comes from the stuffService
			vm.stuff = data;
		});
});

angular.module('routerApp', ['routerRoutes'])

// create the controllers
// this will be the controller for the ENTIRE site
.controller('mainController', function() {
	var vm = this;

	vm.bigMessage = 'A smooth sea never made a skilled sailor.';
})

// home page specific controller
.controller('homeController', function() {
	var vm = this;

	vm.message = 'This is the home page!';
})

// about page controller
.controller('aboutController', function() {
	var vm = this;

	vm.message = 'Look! I am about page.';
})

// contact page controller
.controller('contactController', function() {
	var vm = this;

	vm.message = 'Contact us! JK. This is just a demo.';
})

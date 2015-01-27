// inject ngRoute for all our routing needs
angular.module('routerRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider

		// route for our home
		.when('/', {
			templateUrl: 'views/pages/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		})

		// route for the about page
		.when('/about', {
			templateUrl: 'views/page/about.html',
			controller: 'aboutController',
			controllerAs: 'about'
		})

		// route for the contact page
		.when('/contact', {
			templateUrl: 'views/page/contact.html',
			controller: 'contactController',
			controllerAs: 'contact'
		});

		// set our app up to have pretty URLS
		$locationProvider.html5Mode(true);
});

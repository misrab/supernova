var app = angular.module('app');

	
app.controller('AppController', function($location, $scope, $rootScope, $cookieStore, UserService) {
	init();
	
	function init() {
		//UserService.authenticate();
	};
});
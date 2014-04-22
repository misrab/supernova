var app = angular.module('app');

	
app.controller('AppController', function($http, $location, $scope, $rootScope, $cookieStore, UserService) {
	init();
	
	function init() {
		//UserService.authenticate();
		UserService.setHttpBasicHeaders();
	};
	
});
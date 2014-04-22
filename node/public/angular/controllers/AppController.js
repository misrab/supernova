var app = angular.module('app');

	
app.controller('AppController', function($http, $location, $scope, $rootScope, $cookieStore, UserService) {
	init();
	
	function init() {
		$rootScope.currentUser = $rootScope.currentUser || $cookieStore.get('user') || null;
		UserService.setHttpBasicHeaders();		
	};
	
});
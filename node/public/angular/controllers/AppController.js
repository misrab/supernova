var app = angular.module('app');

	
app.controller('AppController', function($rootScope, $cookieStore, UserService) {
	init();
	
	function init() {
		//$cookieStore.remove('user');
		$rootScope.currentUser = $rootScope.currentUser || $cookieStore.get('user') || null;		
		UserService.setHttpBasicHeaders();		
	};
	
});
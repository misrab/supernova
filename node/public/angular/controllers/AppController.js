var app = angular.module('app');

	
app.controller('AppController', function($location, $scope, $rootScope, $cookieStore, UserService) {
	init();
	
	function init() {
		$rootScope.currentUser = $cookieStore.get('user') || $rootScope.currentUser || null;
    	//$cookieStore.remove('user');
    	
    	
    	if (!$rootScope.currentUser && $location.path()!='/') $location.url('/login');
    	else if ($rootScope.currentUser && $location.path()!='/workspace') $location.url('/workspace');
    	
    	//console.log('Current user: ' + $rootScope.currentUser);
		//$rootScope.currentUser = null; getCurrentUser();
	};
});
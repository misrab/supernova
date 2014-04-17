var app = angular.module('app');

	
app.controller('AppController', function($scope, $rootScope, $cookieStore, UserService) {
	/*
	 *	Login, signup, logout, isUserAuthenticated
	 */
	function postUser(email, password, route) {
		// if no pass validation
		if (email==undefined || password==undefined) {
			$('.alert-danger').html('Please provide a valid email and password');
			$('.alert-danger').show();
			return;
		}
		UserService.postUserInfo(email, password, route);
	}
	$scope.postSignup = function() {
		var email = $scope.email;
		var password = $scope.password;
		postUser(email, password, '/user');
	};
	$scope.postLogin = function() {
		var email = $scope.email;
		var password = $scope.password;
		postUser(email, password, '/session');
	};
	//$scope.isUserAuthenticated = UserService.isUserAuthenticated;


	init();
	
	function init() {
		$rootScope.currentUser = $cookieStore.get('user') || $rootScope.currentUser || null;
    	//$cookieStore.remove('user');
    	
    	console.log('Current user: ' + $rootScope.currentUser);
		//$rootScope.currentUser = null; getCurrentUser();
	};

	$scope.data = [1,2,3,4,5];
});

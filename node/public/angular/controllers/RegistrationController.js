var app = angular.module('app');

	
app.controller('RegistrationController', function($scope, UserService) {
	init();
	
	
	function init() {
		//if (UserService.getUserAuthenticated()) {
		//	$location.path('/workspace');
		//}
	};

	/*
	 *	Login, signup, logout
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
	
	$scope.logout = UserService.logout;
});
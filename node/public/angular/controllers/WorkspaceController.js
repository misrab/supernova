var app = angular.module('app');

	
app.controller('WorkspaceController', function($http, $scope, UserService, UploadService) {

	init();
	
	function init() {
		// ! authenticate user
		UserService.authenticate();
		
		// listen to file select
		$scope.onFileSelect = function($files) {
			UploadService.onFileSelect($files, $scope);
		};
		
		//$scope.data = [1,2,3,4];
	};

});
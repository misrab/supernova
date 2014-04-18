var app = angular.module('app');

	
app.controller('WorkspaceController', function($http, $scope, UserService, UploadService) {

	init();
	
	function init() {
		UserService.authenticate();
		
		$scope.onFileSelect = function($files) {
			UploadService.onFileSelect($files, $scope);
		};
		
		$scope.data = [1,2,3,4];
	};
	
	
	$scope.test = function() {
		$http.get('http://localhost:5000')
			.success(function(data) {
				alert(data);
				console.log(data);
			});
	};

});
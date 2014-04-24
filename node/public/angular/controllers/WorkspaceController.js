var app = angular.module('app');

	
app.controller('WorkspaceController', function($scope, CubeService) {
	
	init();
	
	function init() {
		// is there any data? default false
		// ! before refeshCubes()
		$scope.dataBool = false; 
		refreshCubes();
	};
	
	
	function refreshCubes() {
		CubeService.getCubes(function(cubes) {
			CubeService.addCubesToView(cubes, $scope);
		});
	};
	

});
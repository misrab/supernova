var app = angular.module('app');

	
app.controller('WorkspaceController', function(CubeService) {
	
	init();
	
	function init() {
		refreshCubes();		
	};
	
	
	function refreshCubes() {
		CubeService.getCubes(function(data) {
			CubeService.addCubesToView(data);
		});
	};
	
	
	
	

});
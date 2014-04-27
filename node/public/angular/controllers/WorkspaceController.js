var app = angular.module('app');

	
app.controller('WorkspaceController', function($scope, CubeService) {
	
	init();
	
	function init() {
		// is there any data? default false
		// ! before refeshCubes()
		$scope.dataBool = false; 
		refreshCubes();
		//sidebarToggle();
	};
	
	
	// bind sidebar toggle button
	/*
	function sidebarToggle() {
		var btn = $('#sidebar_toggle');
		var sidebar = $('#sidebar-wrapper');
		
		sidebar.click(function(e) {
			e.preventDefault();
			sidebar.animate({ width: 0 }, 1000);
		});
	};*/
	
	
	function refreshCubes() {
		CubeService.getCubes(function(cubes) {
			CubeService.addCubesToView(cubes, $scope);
		});
	};
	

});
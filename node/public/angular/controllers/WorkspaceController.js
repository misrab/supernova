var app = angular.module('app');

	
app.controller('WorkspaceController', function($scope, CubeService) {
	
	
	/*
	 * Init
	 */
	 
	init();
	
	function init() {
		// is there any data? default false
		// ! before refeshCubes()
		$scope.dataBool = false; 
		refreshCubes();
		$scope.dataView = true;
		$scope.sidebarClick = sidebarClick;
	};
	
	/*
	 * Watching
	 */




	/*
	 * Functions
	 */

	
	// click sidebar button, make active
	function sidebarClick(e, id) {

			e.preventDefault();
			
			var el = $('#'+id);
			
			if (el.hasClass('active')) return;
			
			// make active
			$('.sidebar_item').removeClass('active');
			el.addClass('active');
			
			// set dataView
			//var id = $(this).attr('id');
			
			switch(id) {
				case 'sidebar_data':
					$scope.dataView = true;
					break;
				case 'sidebar_analysis':
					$scope.dataView = false;
					break;
				default:
					return;
			};
						
			// show folder and 'files'
			$('sidebar-helper').hide();
			el.next('sidebar-helper').show();
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
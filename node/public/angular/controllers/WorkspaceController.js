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
		$scope.dataView = 'data_summary';
		$scope.sidebarClick = sidebarClick;
		
		// for data view zoom in and chart buttons
		$scope.zoomCubes = zoomCubes;
		// more generic version
		$scope.workspaceViewChange = workspaceViewChange;
		$scope.selectedCubes = [];
	};
	
	/*
	 * Watching
	 */




	/*
	 * Functions
	 */
	 
	function workspaceViewChange(target) {
		$scope.dataView = target;
	};

	function zoomCubes() {
		workspaceViewChange('data_zoom');
		
		$scope.selectedCubes = $.grep($scope.cubes, function( cube ) {
        	return $scope.selectedCubes[ cube.id ];
      	});
      	//console.log(JSON.stringify($scope.selectedCubes));
	};

	
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
					$scope.dataView = 'data_summary';
					break;
				case 'sidebar_analysis':
					$scope.dataView = 'data_analysis';
					break;
				default:
					return;
			};			
	};
	
	
	function refreshCubes() {
		CubeService.getCubes(function(cubes) {
			if (cubes && cubes.length) {
				$scope.dataBool = true;
				$scope.cubes = cubes;
			}
			//CubeService.addCubesToSidebar(cubes, $scope);
		});
	};
	

});
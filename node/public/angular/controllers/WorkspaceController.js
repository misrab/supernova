var app = angular.module('app');

	
app.controller('WorkspaceController', function($http, $scope, $compile, CubeService) {

	init();
	
	function init() {
	
		//var data = CubeFactory.getCubes();
		
		CubeService.getCubes(function(data) {
			var spot = $('#cubes');
			for (var i=0; i<data.length; i++) {
				var newElement = $compile( '<cube-summary></cube-summary')( $scope );
				spot.append(newElement);
			}
		});
	};

});
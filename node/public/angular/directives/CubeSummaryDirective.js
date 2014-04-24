var app = angular.module('app');


app.directive('cubeSummary', function($http, CubeService) {
	
	function link(scope, element, attrs) {
		var cubeId = scope.data.id;
		var csvPath = scope.data.data_path;
		var remove = $('.remove_cube', element);
		
		
		CubeService.confirmClick(remove, function() {
			CubeService.removeCube(element, cubeId);
		});
		
		
		// !! $http gets error with S3,
		// I think header settings
		// use d3 or jquery
		// d3.csv(csvPath, function(data) {
		// });
	};


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/cubeSummary.html',
		link:			link
	};
});
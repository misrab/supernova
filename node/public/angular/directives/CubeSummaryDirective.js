var app = angular.module('app');


app.directive('cubeSummary', function($http, CubeService) {
	
	function link(scope, element, attrs) {
		var cubeId = scope.data.id;
		var csvPath = scope.data.data_path;
		var remove = $('.remove_cube', element);
		
		
		CubeService.confirmClick(remove, function() {
			CubeService.removeCube(element, cubeId);
		});
		
		/*
		$http.get(csvPath)
			.success(function(data) {
				console.log(data);
			});
		*/
	};


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/cubeSummary.html',
		link:			link
	};
});
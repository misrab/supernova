var app = angular.module('app');


app.directive('cubeSummary', function($http, CubeService) {


	
		
						
	/*
	 *	Link function
	 */

	function link(scope, element, attrs) {
		var cubeId = scope.data.id;
		var csvPath = scope.data.data_path;
		var remove = $('.remove_cube', element);
		
		
		// Cube removal with confirmation modal
		CubeService.confirmClick(remove, function() {
			CubeService.removeCube(element, cubeId);
		});
		
		
		scope.updateLabel = function(index, value) {
			CubeService.updateMeta('labels', index, value, cubeId);
		};
		
		
		// true if items the same
		scope.show = function(type, otherType) {
			return type != otherType;
		};
		
		/*** Get CSV data on compile ***/
		// !! $http gets error with S3,
		// I think header settings
		// use d3 or jquery
		// d3.csv(csvPath, function(data) {
		// });
		$.ajax({
			type:		"GET",
			url: 		csvPath,
			success: 	function(csvString){
							CubeService.displayCsvTable(element, csvString);
		   				},
		   	error:		function() {
		   					console.log('Error fetching csv file...');
		   				},
			timeout: 	5000 //in milliseconds
		});
		
	};


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/cubeSummary.html',
		link:			link
	};
});
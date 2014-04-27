var app = angular.module('app');


app.directive('cubeSummary', function($http, CubeService) {


	
		
						
	/*
	 *	Link function
	 */

	function link(scope, element, attrs) {
		var cubeId = scope.data.id;
		var csvPath = scope.data.data_path;
		var remove = $('.remove_cube', element);
		
		
		init();
		
		/*
		 *	Init function
		 */
		
		
		function init() {
			bindRemove();
			setScopeFunctions();
			getCsvData();
		};
		
		
		
		/*
		 *	Internal functions
		 */
		
		
		function bindRemove() {
			// Cube removal with confirmation modal
			CubeService.confirmClick(remove, function() {
				CubeService.removeCube(element, cubeId);
			});
		};
		
		// for use in html directives
		function setScopeFunctions() {
			scope.updateLabel = function(index, value) {
				CubeService.updateMeta('labels', index, value, cubeId);
			};
		
			// true if items the same
			scope.show = function(type, otherType) {
				return type != otherType;
			};
		};
		
		
		// Get CSV data on compile
		function getCsvData() {	
			$.ajax({
				type:		"GET",
				url: 		csvPath,
				success: 	function(csvString){
								CubeService.displayCsvTable(element, csvString);
								bindSeeMore();
							},
				error:		function() {
								console.log('Error fetching csv file...');
							},
				timeout: 	5000 //in milliseconds
			});
		};
		
		// used in getCsvData()
		// need table loaded to determine overflow
		function bindSeeMore() {
			var cubeSummary = element.find('.cube_summary');
			//var table = cubeSummary.find('.cube_data_table');
			
			function cubeOverflowing() {
				var cube_h = cubeSummary.height();
				var table_h = element.find('.cube_data_table').height();
				return cube_h < table_h;
			};
			
			function seeMoreClick(e) {				
				e.preventDefault();
				
				var table_h = element.find('.cube_data_table').height();
				var INCREMENT = 200;
				
				//console.log('old h: ' + cubeSummary.height());
				//console.log('table h : ' + table_h);
				
				// new height min of table or current + x
				var new_h = String(Math.min(cubeSummary.height()+INCREMENT, table_h)) + 'px';
				
				console.log('new h: ' + new_h);
				
				// increase height
				cubeSummary.animate({ height: new_h }, 1000, function() {
					console.log('done');
					// show see more or not
					if (cubeOverflowing()) {
						$(this).show();
					} else {
						$(this).hide();
					}
				});
			};
	
			if (cubeOverflowing()) {
			   // show seeMore
			   var seeMore = $('.cube_see_more', element);
			   seeMore.show();
			   seeMore.click(seeMoreClick);
			}
		};
		
		
	
		
	};


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/cubeSummary.html',
		link:			link
	};
});
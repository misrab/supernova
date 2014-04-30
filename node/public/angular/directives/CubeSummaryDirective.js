var app = angular.module('app');


app.directive('cubeSummary', function($http, CubeService) {
						
	/*
	 *	Link function
	 */

	function link(scope, element, attrs) {
	
		//console.log('Cube: ' + JSON.stringify(scope.data));
	
	
		var cubeId = scope.data.id;
		var csvPath = scope.data.data_path;
		var remove = $('.remove_cube', element);
		
		
		init();
		
		/*
		 *	Init function
		 */
		
		
		function init() {
			//bindRemove();
			setScopeFunctions();
			getCsvData();
			//bindSeeMore();
		};
		
		
		/*
		 *	Internal functions
		 */
		 
		
		
		// for use in html directives
		function setScopeFunctions() {
			scope.updateLabel = function(index, value) {
				CubeService.updateMeta('labels', index, value, cubeId);
			};
		
			// true if items the same
			scope.show = function(type, otherType) {
				return type != otherType;
			};
			
			scope.cubeSeeMore = cubeSeeMore;
			
			scope.cubeRemove = cubeRemove;
		};
		
		
		// Get CSV data on compile
		function getCsvData() {	
			$.ajax({
				type:		"GET",
				url: 		csvPath,
				success: 	function(csvString){
								CubeService.displayCsvTable(element, csvString);
								//bindSeeMore();
							},
				error:		function() {
								console.log('Error fetching csv file...');
							},
				timeout: 	5000 //in milliseconds
			});
		};
		
		
		function cubeSeeMore() {
		
			var cubeSummary = element.find('.cube_summary');
			var seeMore = $('.cube_see_more', element);
			function cubeOverflowing() {
				var cube_h = cubeSummary.height();
				var table_h = element.find('.cube_data_table').height();
				return cube_h < table_h;
			};
			
			/*
			function seeMoreClick(e) {				
				e.preventDefault();
				
				var table_h = element.find('.cube_data_table').height();
				var INCREMENT = 300;
				
				// new height min of table or current + x
				var new_h = String(Math.min(cubeSummary.height()+INCREMENT, table_h)) + 'px';
								
				// increase height
				cubeSummary.animate({ height: new_h }, 1000, function() {
					// show see more or not
					if (cubeOverflowing()) {
						seeMore.show();
					} else {
						seeMore.hide();
					}
				});
			};*/
			
			function showMore() {
				var table_h = element.find('.cube_data_table').height();
				var INCREMENT = 500;
				
				// new height min of table or current + x
				var new_h = String(Math.min(cubeSummary.height()+INCREMENT, table_h)) + 'px';
								
				// increase height
				cubeSummary.animate({ height: new_h }, 1000, function() {
					// show see more or not
					if (cubeOverflowing()) {
						seeMore.show();
					} else {
						seeMore.hide();
					}
				});
			};			
			
			if (cubeOverflowing()) {
			   // show seeMore
			   showMore();
			   //seeMore.show();
			   //seeMore.click(seeMoreClick);
			   //seeMore.click();
			} else {
				seeMore.hide();
			}
		};
		
		/*
		function bindSeeMore() {
			var cubeSummary = element.find('.cube_summary');
			var seeMore = $('.cube_see_more', element);
			//var table = cubeSummary.find('.cube_data_table');
			
			function cubeOverflowing() {
				var cube_h = cubeSummary.height();
				var table_h = element.find('.cube_data_table').height();
				return cube_h < table_h;
			};
			
			function seeMoreClick(e) {				
				e.preventDefault();
				
				var table_h = element.find('.cube_data_table').height();
				var INCREMENT = 300;
				
				// new height min of table or current + x
				var new_h = String(Math.min(cubeSummary.height()+INCREMENT, table_h)) + 'px';
								
				// increase height
				cubeSummary.animate({ height: new_h }, 1000, function() {
					// show see more or not
					if (cubeOverflowing()) {
						seeMore.show();
					} else {
						seeMore.hide();
					}
				});
			};
			
	
			if (cubeOverflowing()) {
			   // show seeMore
			   seeMore.show();
			   seeMore.click(seeMoreClick);
			}
		};*/
		
		
		/*
		function bindRemove() {
			// Cube removal with confirmation modal
			CubeService.confirmClick(remove, function() {
				CubeService.removeCube(element, cubeId);
			});
		};*/
		
		function cubeRemove() {
		
		};
		
	};


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/cubeSummary.html',
		link:			link
	};
});
var app = angular.module('app');



/**********************
	data-summary
***********************/
app.directive('overallSummary', function() {
	function link(scope, element, attrs) {
		init();
		
		function init() {
			//scope.zoomCubes = zoomCubes;
		};
	};
	
	/*
	function zoomCubes($scope) {
		$scope.dataView = 'data_analysis';
	};*/
	
	
	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/overallSummary.html',
		link:			link
	};
});

/**********************
	sidebar menu item
***********************/


/*
app.directive('sidebarItem', function() {
	function link(scope, element, attrs) {
		
		// Init and vars
		 
		 
		var cubeId = scope.cubeId;
		init();
		
		function init() {
			bindToggleView();
		};
		
	
		
		//	Internals
		 
		
		// toggle view of cube when user clicks on icon
		function bindToggleView() {
			$('.glyphicon', element).click(function(e) {
				e.preventDefault();
				
				var show; // true if we want to show corresponding cube
				// toggle active class
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
					show = false
				} else {
					$(this).addClass('active');
					show = true;
				}
				
				var cubeHtmlId = '#cube_summary_' + String(cubeId);
				if (show) {
					$(cubeHtmlId).show();
				} else {
					$(cubeHtmlId).hide();
				}
			});
		};
	
	};
	
	
	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/sidebarItem.html',
		link:			link,
		scope:			{
							cubeId:	'@',
							title:	'@'
						}
	};
});
*/

/*****************
	sidebarHelper
******************/

/*
app.directive('sidebarHelper', function() {
	function link(scope, element, attrs) {
	};
	
	
	
	
	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/sidebarHelper.html',
		link:			link
	};
});
*/

/**************
	uploadArea
***************/

app.directive('uploadArea', function($rootScope, UploadService) {
	
	function link(scope, element, attrs) {
		/*
		 *	Init and vars
		 */
		
		init();
		
		function init() {
			// toggle file input display by clicking
			// on image
			scope.clickImage = function(e) {
				e.preventDefault();
				var input = element.find('input:file');
				input.toggle('slow');
			};
			
			// drag and drop css
			bindDragAndDrop();
			// bindFileSelect
			bindFileSelect();
		};
		
		
		
		/*
		 *	Internals
		 */
		function bindFileSelect() {
			var fileInput = $('input:file', element);
			
			
			fileInput.change(function() {
				UploadService.onFileSelect(element, scope);
			});
		};
		
		
		function bindDragAndDrop() {
			var area = $('.upload_area', element);
			var fileInput = $('input:file', element);
			var SUCCESS_GREEN = '#62c462';
		
			// drag and drop of files
			// disable window default
			$(document).bind('drop dragover', function (e) {
				e.preventDefault();
			});
			//element.css('background-color', 'green');
			//alert(area.attr('class'));
			area.bind('dragover', function(e) {
				e.preventDefault();
				e.stopPropagation()
				area.css('background-color', SUCCESS_GREEN);
			});
			area.bind('dragleave drop', function(e) {
				e.preventDefault();
				e.stopPropagation()
				area.css('background-color', 'white');
			});
			area.bind('drop', function(e) {
				e.preventDefault();
				e.stopPropagation()
				fileInput.prop("files", e.originalEvent.dataTransfer.files);
			});
		};
		
		
		
	};


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/uploadArea.html',
		link:			link
	};
});
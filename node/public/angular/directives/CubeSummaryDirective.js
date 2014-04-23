var app = angular.module('app');


app.directive('cubeSummary', function(UploadService) {
	
	function link(scope, element, attrs) {
		
	};


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/cubeSummary.html',
		link:			link
	};
});
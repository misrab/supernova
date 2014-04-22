var app = angular.module('app');




app.directive('uploadArea', function(UploadService) {
	
	function link(scope, element, attrs) {
		// file select
		$('input:file', element).change(function() {
			var files = element[0].files;
			UploadService.onFileSelect(files);
		});
	
	
	}


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/uploadArea.html',
		link:			link
	};
});
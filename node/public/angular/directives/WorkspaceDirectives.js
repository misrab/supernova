var app = angular.module('app');




/**************
	uploadArea
***************/

app.directive('uploadArea', function(UploadService) {
	
	function link(scope, element, attrs) {
		var area = $('.upload_area', element);
		var fileInput = $('input:file', element);
		var SUCCESS_GREEN = '#62c462';
	
		// file select
		fileInput.change(function() {
			var files = element[0].files;
			UploadService.onFileSelect(files, scope);
		});
		
		
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
			/*
			var files = e.originalEvent.dataTransfer.files;
			
			for (var i=0; i<files.length; i++) {
				console.log(fileInput[0].files.push('fds'));
				//fileInput[0].files.push(files[i]);
			}*/
		});
	};


	return {
		restrict: 		'E',
		templateUrl:	'/angular/views/workspace/uploadArea.html',
		link:			link
		/*
		scope:			{
							// to display full or small template
							dataBool:	"="
						}*/
	};
});
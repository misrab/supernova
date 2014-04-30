var app = angular.module('app');

app.service('UploadService', function($http, $route, JobService, CubeService) {
	/*
		Expect #upload_area, .progress > .progress-bar, .alert-danger html fields
	
	*/
	this.onFileSelect = function(element, $scope) {
		// internal
		function updateProgressBar(progressBar) {
			var xhr = new window.XMLHttpRequest();

			// upload progress
			xhr.upload.addEventListener("progress", function(evt) {
				if (evt.lengthComputable) {
					var percentComplete = 100 * evt.loaded / evt.total;
					var percent_str = String(percentComplete) + '%';
					//Do something with upload progress
					progressBar.css('width', percent_str);
				}
			}, false);

			return xhr;
		};
		
		// main function
		var area = $('.upload_area', element);
		var progress = $('.progress', area);
		var progressBar = $('.progress-bar', progress); // for xhr updating
		var error = $('.alert-danger', area);
		var fileInput = $('input:file', area);
		var files = fileInput[0].files;
		
		
		// A copy of this in Node /api/file POST route as well
		var ALLOWED_TYPES = [
			'text/csv',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		];
		
		// hide for sure
		error.hide();
		
		
		// send request + !! check types
		var request = new FormData();
		for (var i = 0; i < files.length; i++) {
			if (ALLOWED_TYPES.indexOf(files[i].type)==-1) {
				error.html('Please only upload .xls, .xlsx, .csv, or .sav files');
				error.show();
				return; // stop here
			} else {
				request.append("file" + i, files[i]);
			}
		}
		
		// temporarily disable input
		fileInput.attr('disabled', 'disabled');
		progress.show();
		
		//alert($http.defaults.headers.common.Authorization);
		
		
		$.ajax({
			// progress
			xhr:			function() {
								return updateProgressBar(progressBar);
							},
			beforeSend: 	function (xhr) {
								xhr.setRequestHeader ("Authorization", $http.defaults.headers.common.Authorization);
							},

			type: 			"POST",
			url: 			"/api/file",
			data: 			request,
			processData : 	false,
			contentType: 	false,

			success:		function(data) {
								//var str = JSON.stringify(data);
								//console.log(str);
								// show extraction engine
								$('.processing').show();
								
								// start polling for job
								JobService.pollForJob('processFiles', data.jobId, function() { // (cubes)
									//area.hide();
									//$('.processing', area).hide();
									
									// ! just reload page
									$route.reload();
									//CubeService.addCubesToView(cubes, $scope);
								});
								
								//console.log('### Job id is: ' + data.jobId);
							},
			error: 			function(jqXHR, textStatus, errorThrown) {
								if (jqXHR.responseText != '') {
									error.html(jqXHR.responseText);
								} else {
									error.html('Something went wrong');
								}								
								error.show();
							},
			complete:		function() {
								progress.hide();
								// temporarily re-enable input
								// ! not re-enabled until files processed
								//fileInput.removeAttr('disabled');
							}
		});
	
	};
});
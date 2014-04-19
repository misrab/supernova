var app = angular.module('app');

app.service('UploadService', function() {
	/*
		Expect #upload_area, .progress > .progress-bar, .alert-danger html fields
	
	*/
	this.onFileSelect = function() {
		// internal
		function updateProgressBar(progressBar) {
			var xhr = new window.XMLHttpRequest();

			// upload progress
			xhr.upload.addEventListener("progress", function(evt) {
				if (evt.lengthComputable) {
					var percentComplete = 100* evt.loaded / evt.total;
					var percent_str = String(percentComplete) + '%';
					//Do something with upload progress
					progressBar.css('width', percent_str);
				}
			}, false);

			return xhr;
		};
		
		// main function
		var area = $('#upload_area');
		var progress = $('.progress', area);
		var progressBar = $('.progress-bar', progress); // for xhr updating
		var error = $('.alert-danger', area);
		var fileInput = $('input:file', area);
		var files = fileInput[0].files;
		
		// hide for sure
		error.hide();
		
		// temporarily disable input
		fileInput.attr('disabled', 'disabled');
		progress.show();
		
		// send request
		var request = new FormData();
		for (var i = 0; i < files.length; i++) { 
			request.append("file" + i, files[i]);
		}
		//var currentFile = files[0];
		//request.append('file', currentFile);
		//request.append("fileToUpload[]", files);
		
		$.ajax({
			// progress
			xhr:			function() {
								return updateProgressBar(progressBar);
							},

			type: 			"POST",
			url: 			"/api/file",
			data: 			request,
			processData : 	false,
			contentType: 	false,

			success:		function(data) {
								var str = JSON.stringify(data);
								console.log(str);
							},
			error: 			function(jqXHR, textStatus, errorThrown) {
								error.html('Something went wrong');
								error.show();
							},
			complete:		function() {
								progress.hide();
								// temporarily re-enable input
								fileInput.removeAttr('disabled');
							}
		});
	
	};
});
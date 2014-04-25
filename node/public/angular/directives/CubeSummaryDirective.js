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
		function getFilesize(url, callback) {
			var xhr = new XMLHttpRequest();
			xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET",
										 //  to get only the header
			xhr.onreadystatechange = function() {
				if (this.readyState == this.DONE) {
					callback(parseInt(xhr.getResponseHeader("Content-Length")));
				}
			};
			xhr.send();
		};
		getFilesize(csvPath, function(size) {
			console.log('File size is : ' + size + ' bytes');
		});*/
		
		// !! $http gets error with S3,
		// I think header settings
		// use d3 or jquery
		// d3.csv(csvPath, function(data) {
		// });
		$.ajax({
			type:		"GET",
			url: 		csvPath,
			success: 	function(csvString){
							//console.log(data.length + ' words');
							var dataTable = $('.cube_data_table', element);
							
							
							// use papa parse to stream input
							$.parse(csvString, {
								//delimiter: ",",
								header: false,
								dynamicTyping: false,
								preview: 10,
								step: function(data, file, inputElem) {
									
									var row = data.results[0];
									if (!row) return; // ! occasionally undefined
									
									// !! add empty col for label
									var newRow = '<tr><td></td>';
									for (var i=0; i<row.length; i++) {
										newRow = newRow + '<td>'+row[i]+'</td>';
										//console.log('col');
										//tr.html('<td>'+row[i]+'</td>');
									}
									newRow = newRow + '</tr>';
									//console.log(newRow);
									dataTable.append(newRow);
								}
							});
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
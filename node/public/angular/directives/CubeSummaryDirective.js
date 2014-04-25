var app = angular.module('app');


app.directive('cubeSummary', function($http, CubeService) {


	// parses CSV string and adds to data table for 'element'
	function displayCsvTable(element, csvString) {
		//console.log(data.length + ' words');
		var dataTable = $('.cube_data_table', element);				
		// use papa parse to stream input
		$.parse(csvString, {
			//delimiter: ",",
			header: false,
			dynamicTyping: false,
			preview: 100,			// !! max number to be shown
			step: function(data, file, inputElem) {
				if (!data || data==undefined) return;
				var row = data.results[0];
				if (!row || row==undefined) return;
				dataTable
					.append(
						$('<tr />')
							.append('<td />') // buffer column
							.append(
								$.map(row, function(value, key) {
									return $('<td>'+value.toString()+'</td>');
								})
							)
					);
				
					/*
					.append('<tr />')
					.append(
					) // buffer column
					.append(
						$.map(row, function(value, key) {
							return $('<td>'+value.toString()+'</td>');
						})
					);*/
				
				//console.log('## Row: ' + JSON.stringify(row));
				/*if (!row) return; // ! occasionally undefined
			
				// !! add empty col for label
				var newRow = '<tr><td></td>';
				for (var i=0; i<row.length; i++) {
					newRow = newRow + '<td>'+row[i]+'</td>';
					//console.log('col');
					//tr.html('<td>'+row[i]+'</td>');
				}
				newRow = newRow + '</tr>';
				//console.log(newRow);
				dataTable.append(newRow);*/
			}
		});
	};
							



	
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
							displayCsvTable(element, csvString);
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
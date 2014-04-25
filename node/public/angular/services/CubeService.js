var app = angular.module('app');

app.service('CubeService', function($http, $rootScope, $compile) {


	// updates given meta at index with value
	// e.g. 'label'|'type' at 0 with 'Chicken Name'
	this.updateMeta = function(meta, index, value, cubeId) {
		if (['labels', 'types'].indexOf(meta)==-1) return;
	
		var data = {
			index:	index,
			value:	value,
			cubeId:	cubeId
		};
		
		//alert(JSON.stringify(data));
		//return;
		
		$http.put('/api/cube/'+meta, data)
			.success(function(data) {
				console.log('Successfully updated meta...');
			});
	};



	// parses CSV string and adds to data table for 'element'
	this.displayCsvTable = function(element, csvString) {
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
			}
		});
	};


	this.confirmClick = function(element, fn) {
		element.click(function(e) {
			e.preventDefault();
			
			var dialog = $('#confirmDelete');
			var confirm = $('#confirmDeleteButton');
			
			dialog.modal('show');
			
			confirm.unbind('click');
			confirm.click(function(e) {
				e.preventDefault();
				dialog.modal('hide');
				fn();
			});
		});
	};


	this.removeCube = function(cube, cubeId) {
		//console.log('Removing cube w/ id: ' + cubeId);
		
		var success = $('#main_alerts').find('.alert-success');
		//var error
		
		$http.delete('/api/cube/'+cubeId)
			.success(function(data) {
				if (data.success) {
					cube.remove();
					
					success.html('Cube successfully removed');
					success.slideDown();
					setTimeout(function() {
						success.slideUp();
					}, 3000);
				}
			});
	};

	this.getCubes = function(next) {
		$http.get('/api/cubes')
			.success(next);
	};

	// used in upload service as well
	this.addCubesToView = function(cubes, $scope) {
		if (cubes && cubes.length) $scope.dataBool = true;
					
		var spot = $('#cubes');
		// clear spot
		//spot.html('');
				
		for (var i=0; i < cubes.length; i++) {
			// creating a new scope for each item
			var $newScope = $rootScope.$new();
			$newScope.data = cubes[i];
			var newElement = $compile( '<cube-summary></cube-summary' )( 
				$newScope
			);
			spot.append(newElement);
		}		
	};

});
var app = angular.module('app');

app.service('CubeService', function($http, $rootScope, $compile) {

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
var app = angular.module('app');

app.service('CubeService', function($http, $rootScope, $compile) {

	this.getCubes = function(next) {
		$http.get('/api/cubes')
			.success(next);
	};

	// used in upload service as well
	this.addCubesToView = function(cubes) {
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
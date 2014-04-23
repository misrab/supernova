var app = angular.module('app');

app.service('CubeService', function($http) {

	this.getCubes = function(next) {
		$http.get('/api/cubes')
			.success(next);
	};

});
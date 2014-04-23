var app = angular.module('app');

	
app.controller('WorkspaceController', function($http, $rootScope, $scope, $compile, CubeService) {

	init();
	
	function init() {
	
		//var data = CubeFactory.getCubes();
		
		CubeService.getCubes(function(data) {
			var spot = $('#cubes');
			$scope.boo = 'foo'
			for (var i=0; i < data.length; i++) {
				//var strData = JSON.stringify(data[i])
				//var escapedStrData = strData.replace('"', "'");
				//console.log(data[i].types);
				
				// creating a new scope for each item
				var $newScope = $rootScope.$new();
				$newScope.data = data[i];
				var newElement = $compile( '<cube-summary></cube-summary' )( 
					$newScope
				);
				spot.append(newElement);
			}
		});
	};

});
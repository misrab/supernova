

/*
var mainApp = angular.module('mainApp', []);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/',
			{
				controller: 	'MainController',
				templateUrl:	'/views/landing.html'
			})
		.otherwise({ redirectTo: '/' });

});
*/

var app = angular.module('app', ['ngRoute']);

	
app.controller('AppController', function($scope) {
	$scope.data = [1,2,3,4,5];
});


app.controller('HeaderController', ['$scope', '$location', function($scope, $location) {
	$scope.location = $location;
	$scope.meow = 'meoww';
}]);


app.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: '/angular/views/basic/landing.html', 
      controller: 'AppController'
    })
    .when('/signup', {
      templateUrl: 'index.html', 
      controller: 'AppController'
    })
    .when('/login', {
      templateUrl: 'index.html', 
      controller: 'AppController'
    })
    .otherwise({ redirectTo: '/' });
});
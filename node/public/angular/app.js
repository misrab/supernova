

var app = angular.module('app', [
	'ngRoute',
	//'ngResource',
	'ngCookies',
	'http-auth-interceptor'
]);



app.controller('HeaderController', function($scope, $location) {
	$scope.location = $location;
});


app.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: '/angular/views/basic/landing.html', 
      controller: 'AppController'
    })
    .when('/signup', {
      templateUrl: '/angular/views/basic/signup.html', 
      controller: 'AppController'
    })
    .when('/login', {
      templateUrl: '/angular/views/basic/login.html', 
      controller: 'AppController'
    })
    .when('/workspace', {
      templateUrl: '/angular/views/workspace/index.html', 
      controller: 'AppController'
    })
    .otherwise({ redirectTo: '/' });
});


//app.run(function ($rootScope, $location, Auth) {
app.run(function ($rootScope, $location) {

	//watching the value of the currentUser variable.
	/*
	$rootScope.$watch('currentUser', function(currentUser) {
	  // if no currentUser and on a page that requires authorization then try to update it
	  // will trigger 401s if user does not have a valid session
	  if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) == -1 )) {
		Auth.currentUser();
	  }
	});*/
	
	$rootScope.$watch('currentUser', function(currentUser) {
	  // if no currentUser and on a page that requires authorization then try to update it
	  // will trigger 401s if user does not have a valid session
	  if (!currentUser && (['/workspace'].indexOf($location.path()) != -1 )) {
	  	alert('foo!');
		//Auth.currentUser();
	  }
	});

	// On catching 401 errors, redirect to the login page.
	$rootScope.$on('event:auth-loginRequired', function() {
	  $location.path('/login');
	  return false;
	});
});
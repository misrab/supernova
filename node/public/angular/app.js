

var app = angular.module('app', [
	'ngRoute',
	//'ngResource',
	'ngCookies',
	//'http-auth-interceptor',
	'angularFileUpload'
]);

// directive for ng-enter on enter button press
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
    	element.bind("keydown keypress", function (event) {
        //element.bind("keydown keypress", function (event) {
            if(event.which === 13) { 
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


app.controller('HeaderController', function($scope, $rootScope) {
	//$scope.User = { email: $rootScope.currentUser.email };
	init();
	
	function init() {
	}
	
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
      controller: 'RegistrationController'
    })
    .when('/login', {
      templateUrl: '/angular/views/basic/login.html', 
      controller: 'RegistrationController'
    })
    .when('/workspace', {
      templateUrl: '/angular/views/workspace/index.html', 
      controller: 'WorkspaceController'
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
	
	/*
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
	});*/
});
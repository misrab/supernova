

var app = angular.module('app', [
	'ngRoute',
	//'ngResource',
	'ngCookies',
	'http-auth-interceptor',
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


app.config(function($locationProvider, $routeProvider, $httpProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: '/angular/views/basic/landing.html',
      //controller: 'AppController'
      requireLogin: false
    })
    .when('/signup', {
      templateUrl: '/angular/views/basic/signup.html', 
      controller: 'RegistrationController',
      requireLogin: false
    })
    .when('/login', {
      templateUrl: '/angular/views/basic/login.html', 
      controller: 'RegistrationController',
      requireLogin: false
    })
    .when('/workspace', {
      templateUrl: '/angular/views/workspace/index.html', 
      controller: 'WorkspaceController',
      requireLogin: true
    })
    .otherwise({ redirectTo: '/' });
    
    
    // 401 handling
    // 401
	var logsOutUserOn401 = ['$q', '$location', function ($q, $location) {
		var success = function (response) {
		  return response;
		};

		var error = function (response) {
		  if (response.status === 401) {
		  	// display error
		  	$('.alert-danger').html('Invalid username or password');
		  	$('.alert-danger').show();
		  	
			//redirect them back to login page
			$location.path('/login');

			return $q.reject(response);
		  } 
		  else {
			return $q.reject(response);
		  }
		};

		return function (promise) {
		  return promise.then(success, error);
		};
  	}];

  	$httpProvider.responseInterceptors.push(logsOutUserOn401);
});


app.run(function($rootScope, $location, $cookieStore) {

	// Everytime the route in our app changes check auth status
	$rootScope.$on("$routeChangeStart", function(event, next, current) {
		
		$rootScope.currentUser = $cookieStore.get('user') || null;
		
		// console.log('Current user is ' + JSON.stringify($rootScope.currentUser));
		if (next.requireLogin && !$rootScope.currentUser) {
			// clear cookie just in case mismatch
			$cookieStore.remove('user');
			
			$location.path('/login');
			event.preventDefault();
		}
		// send to workspace if logged in and not in generic page
		else if (!next.requireLogin && $rootScope.currentUser 
			&& ['/terms', '/about'].indexOf($location.path)==-1) {
			
			$location.path('/workspace');
			event.preventDefault();
		}
	});
});
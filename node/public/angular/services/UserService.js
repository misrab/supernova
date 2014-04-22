var app = angular.module('app');

app.service('UserService', function($location, $http, $rootScope, $cookieStore) {
	
	this.logout = function() {
		$rootScope.currentUser = null;
		$cookieStore.remove('user');		
		$location.url('/');
		/*
		$http.delete('/session')
			.success(function(data) {
				$rootScope.currentUser = null;
				$cookieStore.remove('user');
				
				$location.url('/');
			})
			.error(function() {
				console.log('Error logging out')
			});*/
	};

	// either creating a /session or a /user
	this.postUserInfo = function(email, password, route) {
	
		var data = {};
		data.email = email;
		data.password = password;
	
		$http.post(route, data)
			.success(function(data, status, headers, config) {
				if (!data) return;
				
				if (data.success) {
					console.log('Success post user info:' + data.success + ', ' + JSON.stringify(data.user));
					
					$rootScope.currentUser = data.user;
					// store to cookie
					$cookieStore.put('user', $rootScope.currentUser);
					
					// route to workspace
					$location.url('/workspace');
				} else {
					var err = $('.alert-danger');
					err.html(data.message);
					err.show();
				}
			})
			.error(function(data, status, headers, config) {
				console.log('Error post user info');
				return false;
			});
	};
});
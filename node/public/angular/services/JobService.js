var app = angular.module('app');

app.service('JobService', function($http) {
	this.pollForJob = function(jobId) {
		var t = setInterval(function() {
			$http.get('/api/job/'+jobId)
				.success(function(data) {
					console.log('## Received: ' + JSON.stringify(data));
					
					if (data.results != undefined) {
						clearInterval(t);
						//return data;
					}
					//var parsed = JSON.parse(data);
					//console.log('## DATA?:   '+ typeof(parsed));
				});
		}, 2000);
	};
});
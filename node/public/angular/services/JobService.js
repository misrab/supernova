var app = angular.module('app');

app.service('JobService', function($http) {
	this.pollForJob = function(type, jobId, successFn, $scope) {
		var t = setInterval(function() {
			$http.get('/api/job/'+type+'/'+jobId)
				.success(function(data) {
					//console.log('## Received: ' + JSON.stringify(data));
					
					if (data.results != undefined) {
						clearInterval(t);
						successFn(data.results, $scope);
					}
					//var parsed = JSON.parse(data);
					//console.log('## DATA?:   '+ typeof(parsed));
				});
		}, 2000);
	};
});
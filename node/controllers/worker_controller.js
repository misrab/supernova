// var async = require('async');
// ! assumes common client between job scheduler and worker
var client = require('../models').redis.client;


// redis queue names
//var PENDING_JOBS = 'supernovaJobsPending';
//var COMPLETED_JOBS = 'supernovaJobsCompleted';


// adds job with given 'functionName' - expect python worker to understand
// 'dataSources' is ARRAY of ids in gridFS
function addJob(functionName, dataSources) {
	var job = {
		functionName:	functionName,
		dataSources:	dataSources,
		timestamp:		new Date()
	};
	//console.log('##PUSHED: '  + JSON.stringify(job));
	
	client.lpush('pendingjobs', JSON.stringify(job), function(err) {
		//client.rpop('mooo', function(err, reply) {
		//	console.log('##FROM Q: ' + reply);
		//});
	});
	
	/*
	client.lpush(PENDING_JOBS, JSON.stringify(job), function(err) {
		client.rpop(PENDING_JOBS, function(err, reply) {
			console.log('##FROM Q: ' + reply);
		});
	});*/
	
	
	
};

// next(err, result)
// 'result' is completed job, or null
function checkJob(jobId, next) {

}



module.exports = {
	addJob:		addJob
};
// var async = require('async');
// ! assumes common client between job scheduler and worker
var client = require('../models').redis.client;


// redis queue names
var PENDING_JOBS = 'supernovaJobsPending';
var COMPLETED_JOBS = 'supernovaJobsCompleted';


// adds job with given 'functionName' - expect python worker to understand
// 'dataSource' is id in gridFS
function addJob(functionName, dataSource) {
	var job = {
		functionName:	functionName,
		dataSource:		dataSource,
		timestamp:		new Date()
	};
	//console.log('##PUSHED: '  + JSON.stringify(job));
	
	client.lpush(PENDING_JOBS, JSON.stringify(job));
};

// next(err, result)
// 'result' is completed job, or null
function checkJob(jobId, next) {

}



module.exports = {
	addJob:		addJob
};
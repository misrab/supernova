//var crypto = require('crypto');

// var async = require('async');
// ! assumes common client between job scheduler and worker
var client = require('../models').redis.client;


// redis queue names
//var PENDING_JOBS = 'supernovaJobsPending';
//var COMPLETED_JOBS = 'supernovaJobsCompleted';


// adds job with given 'functionName' - expect python worker to understand
// 'dataSources' is ARRAY of ids in gridFS
// next(err, jobId)
function addJob(functionName, dataSources, jobId) {
	console.log('### PUSHED JOB with id: ' + jobId);

	//var jobId = crypto.randomBytes(20).toString('hex');
	var job = {
		id:				jobId,
		functionName:	functionName,
		dataSources:	dataSources,
		timestamp:		new Date()
	};
	//console.log('##PUSHED: '  + JSON.stringify(job));
	
	client.lpush('pendingjobs', JSON.stringify(job), function(err) {
		//if (err) return next(err);
		//next(null, jobId);
	});
};

// next(err, result)
// ! expect 
function checkJob(jobId, next) {
	//console.log('## CHECKING job with id: ' + jobId);

	client.get(jobId, function(err, reply) {
		if (err) return next(err);
		if (reply) {
			next(null, JSON.parse(reply.toString()));
		} else {
			next(null, null);
		}
	});
}


module.exports = {
	addJob:		addJob,
	checkJob:	checkJob
};
var crypto = require('crypto');

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
		id:				crypto.randomBytes(20).toString('hex'),
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
};



module.exports = {
	addJob:		addJob
};
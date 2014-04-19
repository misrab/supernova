// var async = require('async');
// ! assumes common client between job scheduler and worker
var client = require('../models').redis.client;



// adds job with given 'functionName' - expect python worker to understand
// 'dataSource' is id in gridFS
function addJob(functionName, dataSource) {
	var job = {
		functionName:	functionName,
		dataSource:		dataSource,
		timestamp:		new Date()
	};
	
	//console.log('##PUSHED: '  + JSON.stringify(job));
	
	client.lpush('supernovaJobs', JSON.stringify(job));
	
	
	//client.lpush('supernovaJobs', 'zooooo');
	//client.rpush('zoo');
	/*
	client.rpop('supernovaJobs', function(err, reply) {
		console.log(reply);
	});
	client.rpop('supernovaJobs', function(err, reply) {
		console.log(reply);
	});*/
}



module.exports = {
	addJob:		addJob
}
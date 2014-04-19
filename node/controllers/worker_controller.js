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
};



module.exports = {
	addJob:		addJob
};
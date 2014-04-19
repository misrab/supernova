var async = require('async');
var mongo = require('mongodb')
	, Db = mongo.Db
	, Grid = mongo.Grid;



// takes array of string 'filepaths'
// writes files to mongo gridFS
// next(err, ids): 'ids' is array of mongo ids to retrieve file(s)
function writeFilesToMongo(filepaths, next) {
	var ids = [];
	
	async.each(filepaths, function(filepath, cb) {
		ids.push(filepath);
		cb();
	}, function(err) {
		next(err, ids);
	});
};


module.exports = {
	writeFilesToMongo:	writeFilesToMongo
};
var async = require('async');

/*
var mongo = require('mongodb')
	, MongoClient = require('mongodb').MongoClient
	, ObjectID = require('mongodb').ObjectID
	, GridStore = require('mongodb').GridStore
	, Grid = require('mongodb').Grid;*/
  



// next(err, mongoId)
function writeSingleFile(db, filepath, next) {
	next(null, null);
};


// takes array of string 'filepaths'
// writes files to mongo gridFS
// next(err, ids): 'ids' is array of mongo ids to retrieve file(s)
function writeFilesToMongo(filepaths, next) {
	var ids = [];
	
	next(null, null);
	/*
	// connect to mongo
	MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
		if (err) return console.log(err);
		

		// write each file
		async.each(filepaths, function(filepath, cb) {
			writeSingleFile(db, filepath, function(err, id) {
				if (err) return cb(err);
			
				ids.push(id);
				cb();
			});
		}, function(err) {
			// close db
			db.close();
			// forward results
			next(err, ids);
		});
	});*/
};


module.exports = {
	writeFilesToMongo:	writeFilesToMongo
};
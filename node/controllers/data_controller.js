var async = require('async');

/*
var db_mongo = require('../models').mongo // db is in db_mongo.mongo.db
	, ObjectID = require('mongodb').ObjectID
	, GridStore = require('mongodb').GridStore;*/
	
var mongo = require('mongodb')
	, Db = mongo.Db
	, ObjectID = require('mongodb').ObjectID
	, GridStore = require('mongodb').GridStore;
  



// next(err, mongoId)
function writeSingleFile(db, filepath, next) {
	var fileId = new ObjectID();
	var gridStore = new GridStore(db, fileId, "w", { root:'fs' });
	gridStore.chunkSize = 1024 * 512;
	
	gridStore.writeFile(filepath, function(err, fileInfo) {
		if (err) return next(err);
		next(null, fileId);
	});
};


// takes array of string 'filepaths'
// writes files to mongo gridFS
// next(err, ids): 'ids' is array of mongo ids to retrieve file(s)
function writeFilesToMongo(filepaths, next) {
	var ids = [];
	
	// connect to mongo
	Db.connect(process.env.MONGOHQ_URL, function(err, db) {
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
	});
};


module.exports = {
	writeFilesToMongo:	writeFilesToMongo
};
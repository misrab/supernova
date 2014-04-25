var async = require('async');
var crypto = require('crypto');
var knox = require('knox');

var db_pg = require('../models').pg;
var User = db_pg.User;
var Cube = db_pg.Cube;


var client = knox.createClient({
    key: 	process.env.AWS_ACCESS_KEY_ID
  , secret: process.env.AWS_SECRET_ACCESS_KEY
  , bucket: process.env.S3_BUCKET_NAME
});


/********************

	INTERNAL

*********************/

// replace cube urls with authenticated urls for
// client access to S3
// next(err, newCubes)
function replaceCubeUrls(cubes, next) {
	var newCubes = [];
	var expiration = new Date();
	expiration.setMinutes(expiration.getMinutes() + 30);
	
	async.each(cubes, function(cube, cb) {
		
		cube.data_path = client.signedUrl(cube.data_path, expiration);
		newCubes.push(cube);
		cb();
	}, function(err) {
		if (err) return cb(err);
		next(null, newCubes);
	});
};


// next(err, cube)
function checkCubeOwnership(email, cubeId, next) {
	async.waterfall([
		// get user first for authentication
		function(cb) {
			User.find({ where: { email: email } }).success(function(user) {
				cb(null, user);
			}).error(cb);
		},
		// get cube
		function(user, cb) {
			Cube.find(cubeId).success(function(cube) {
				cb(null, user, cube);
			}).error(cb);
		},
		// check ownership
		function(user, cube, cb) {
			if (user.id != cube.UserId) {
				var error = new Error('You do not own that cube');
				return cb(error);
			}
			cb(null, cube);
		}
	], next);
};


/********************

	EXTERNAL

*********************/


// takes array of string 'filepaths'
// next(err, urls) urls array of file locations
function writeFilesToStore(userId, files, next) {
	var urls = [];
		
	async.each(files, function(file, cb) {
	
		var filepath = file.path;
		var filename = file.name;
		var fileExt = filename.split('.').pop();
		var newPath = '/files/' + userId + '/' + crypto.randomBytes(128).toString('hex') + '.' + fileExt;
		
		// ! moving on asap
		urls.push(newPath);
		
		client.putFile(filepath, newPath, function(err, res) {
			if (err) console.log('Error pushing file to S3');
			//urls.push(newPath);
		 	 // Always either do something with `res` or at least call `res.resume()`.
		  	res.resume();
		});
		
		cb();
	}, function(err) {
		if (err) return next(err);
		next(null, urls);
	});
};


// user email, array of cubes
function associateCubes(email, cubes, next) {
	async.waterfall([
		// find user
		function(cb) {		
			User.find({ where: { email: email } }).success(function(user) {
				cb(null, user);
			}).error(cb);
		},
		// create cubes
		function(user, cb) {
			var sqlCubes = [];
			async.each(cubes, function(c, cb) {
				Cube.create({
					labels:		c['labels'],
					types:		c['types'],
					tidbits:	c['tidbits'],
					num_rows:	c['num_rows'],
					data_path:	c['data_path'],
					UserId:		user.id
				}).success(function(cube) {
					sqlCubes.push(cube);
					cb();
				}).error(cb);
			}, function(err) {
				if (err) return cb(err);
				cb(null, sqlCubes);
			});
		},
		// convert them to JSON
		function(cubes, cb) {
			var results = [];
			async.each(cubes, function(c, cb) {
				results.push(c.toJSON());
				cb();
			}, function(err) {
				if (err) return cb(err);
				cb(null, results);
			});
		}
	], next);
};


function getUserCubes(email, next) {
	async.waterfall([
		// get user
		function(cb) {
			User.find({ where: { email: email } }).success(function(user) {
				cb(null, user);
			}).error(cb);
		},
		// get cubes
		function(user, cb) {
			// ! ordered to keep things consistent
			user.getCubes({ order: 'id ASC' }).success(function(cubes) {	
				// !! return as json!		
				cb(null, cubes);
			}).error(cb);
		},
		// convert them to JSON
		function(cubes, cb) {
			var results = [];
			async.each(cubes, function(c, cb) {
				results.push(c.toJSON());
				cb();
			}, function(err) {
				if (err) return cb(err);
				cb(null, results);
			});
		},
		// get authenticated urls
		function(cubes, cb) {
			replaceCubeUrls(cubes, cb);
		}
	], next);
};

function removeCube(cubeId, email, next) {
	var cubeId = parseInt(cubeId);
	if (isNaN(cubeId)) {
		var error = new Error('Cube id must be an integer');
		return next(error);
	}

	async.waterfall([
		// check ownership
		function(cb) {
			checkCubeOwnership(email, cubeId, cb);
		},
		// remove data from S3
		function(cube, cb) {
			client.deleteFile(cube.data_path, function(err, res){
  				// check `err`, then do `res.pipe(..)` or `res.resume()` or whatever.
  				if (err) console.log('Error deleting S3 cube data');
  				//return cb(err);
  				res.resume(); // not sure why
			});
			cb(null, cube);
		},
		// destroy sql cube
		function(cube, cb) {
			cube.destroy().success(cb).error(cb);
		}
	], next);
};





// next(err)
function updateCubeMeta(email, meta, cubeId, index, value, next) {
	async.waterfall([
		// get user first for authentication
		function(cb) {
			checkCubeOwnership(email, cubeId, cb);
		},
		function(cube, cb) {
			// check cube there
			if (!cube) {
				var err = new Error('No such cube');
				return cb(err);
			}
			
			// check meta
			if (['labels', 'types'].indexOf(meta)==-1) {
				var err = new Error('Invalid meta type');
				return cb(err);
			}
			
			// check index bounds
			var intIndex = parseInt(index);
			console.log('## int index: ' + String(intIndex));
			if (isNaN(intIndex) || intIndex < 0 || intIndex >= cube[meta].length) {
				var err = new Error('Index out of range');
				return cb(err);
			} else {
				cube[meta][intIndex] = value;
				// save cube
				cube.save().success(function() {
					cb();
				}).error(cb);
			}
		}
	], next);
};



module.exports = {
	writeFilesToStore:	writeFilesToStore,
	associateCubes:		associateCubes,
	getUserCubes:		getUserCubes,
	removeCube:			removeCube,
	updateCubeMeta:		updateCubeMeta
};
var worker_controller = require('../../controllers/worker_controller.js');
var data_controller = require('../../controllers/data_controller.js');

var async = require('async');
var passport = require('passport');
var crypto = require('crypto');

function getEmail(req) {
	var header=req.headers['authorization']||'',          // get the header
	  token=header.split(/\s+/).pop()||'',            // and the encoded auth token
	  auth=new Buffer(token, 'base64').toString(),    // convert from base64
	  parts=auth.split(/:/),                          // split on colon
	  username=parts[0];
	  //password=parts[1];
	  
	return username;
}


module.exports = function(app) {
	// change label or type
	// :meta is 'label' or 'type'
	// expect in body cubeId, value, index
	app.put('/api/cube/:meta', passport.authenticate('basic', { session: false }), function(req, res) {
		var email = getEmail(req);
		data_controller.updateCubeMeta(email, req.param('meta'), req.body.cubeId, req.body.index, req.body.value, function(err) {
			if (err) {
				console.log('Error updating meta: ' + JSON.stringify(err));
				return res.send(400);
			}
			res.send(200);
		});
	});


	// get user's cubes
	app.get('/api/cubes', passport.authenticate('basic', { session: false }), function(req, res) {
		var email = getEmail(req);
		data_controller.getUserCubes(email, function(err, cubes) {		
			if (err) return res.send(400);
			res.json(cubes);
		});
	});

	// delete a cube
	app.delete('/api/cube/:id', passport.authenticate('basic', { session: false }), function(req, res) {
		var email = getEmail(req);
		data_controller.removeCube(req.param('id'), email, function(err, result) {
			if (err) return res.send(400);
			res.json(200, { success: true });
		});
	});

	// check on job
	// if processFiles it also associates cubes when done
	app.get('/api/job/:type/:id', passport.authenticate('basic', { session: false }), function(req, res) {
		worker_controller.checkJob(req.param('id'), function(err, result) {
			if (err) return res.send(400);
			
			
			if (result!=null && result.results!=undefined && req.param('type')=='processFiles') {
				
				var email = getEmail(req);
				data_controller.associateCubes(email, result.results, function(err, cubes) {
					if (err) console.log('## Error associating cubes: ' + JSON.stringify(err));
					//result.results = cubes;
										
					result.results = [];
					res.json(200, result);
				});
			} else {
				res.json(200, result);
			}
			
			//res.json(200, result);
		});
	});

	
	// post file(s) for processing
	// respond with job id for polling
	app.post('/api/file', passport.authenticate('basic', { session: false }), function(req, res) {
		
		/*
			allowed types...
			text/csv
			application/vnd.ms-excel
			application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
			
			(later ods, tsv, txt)
			application/vnd.oasis.opendocument.spreadsheet
			text/tab-separated-values
			text/plain
		*/
		
		// bool if file type ok
		function checkFileType(file) {
			// A copy of this in Angular UploadService as well
			var ALLOWED_TYPES = [
				'text/csv',
				'application/vnd.ms-excel',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			];
			var mime = file.mime;
			//var filepath = file.path;
			//var filename = file.name;
			//var fileExt = filename.split('.').pop();
			if (ALLOWED_TYPES.indexOf(mime)==-1) return false;
			
			return true;
		}
		
	
		var files = [];
		for (key in req.files) {		
			if (checkFileType(req.files[key])==false) {
				return res.send(400, 'Please only upload .xls, .xlsx, .csv, or .sav files')
			} else {
				files.push(req.files[key]);
			}
		}
		
		// ! get back to them asap
		var jobId = crypto.randomBytes(20).toString('hex');
		res.json(200, { jobId: jobId });
		
		
		async.waterfall([
			// write files to store - /tmp directory is not persistent!
			function(cb) {
				data_controller.writeFilesToStore(req.user.id, files, cb);
			},
			// pass to worker for processing
			function(urls, cb) {			
				worker_controller.addJob('processFiles', urls, jobId);
				cb();
			}
		], function(err, jobId) {
			if (err) {
				console.log('Error processing files');
				//return res.send(400, 'Error processing files');
			}
			//res.json(200, { jobId: jobId });
		});
	});
}
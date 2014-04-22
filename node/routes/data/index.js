var worker_controller = require('../../controllers/worker_controller.js');
var data_controller = require('../../controllers/data_controller.js');

var async = require('async');
var passport = require('passport');


module.exports = function(app) {
	app.get('/api/data', passport.authenticate('basic', { session: false }), function(req, res) {
	
		res.send(200, 'data');
	});
	
	
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
		res.send(200);
		
		async.waterfall([
			// write files to store - /tmp directory is not persistent!
			function(cb) {
				data_controller.writeFilesToStore(req.user.id, files, cb);
			},
			// pass to worker for processing
			function(urls, cb) {			
				worker_controller.addJob('processFiles', urls);
				cb();
			}
		], function(err) {
			if (err) console.log('Error processing files');
		});
	});
}
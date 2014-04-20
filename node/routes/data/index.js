var worker_controller = require('../../controllers/worker_controller.js');
var data_controller = require('../../controllers/data_controller.js');

var async = require('async');


module.exports = function(app) {
	app.get('/api/data', function(req, res) {
	
		res.send(200, 'data');
	});
	
	
	app.post('/api/file', function(req, res) {
		// don't keep them waiting!
		res.send(200);
		
	
		var files = [];
		for (key in req.files) { files.push(req.files[key]); }
		
		// TODO: screen file.mime

		async.waterfall([
			// write files to store
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
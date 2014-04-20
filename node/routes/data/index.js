var worker_controller = require('../../controllers/worker_controller.js');
var data_controller = require('../../controllers/data_controller.js');

var async = require('async');


module.exports = function(app) {
	app.get('/api/data', function(req, res) {
	
		res.send(200, 'data');
	});
	
	
	app.post('/api/file', function(req, res) {
		var filepaths = [];
		for (key in req.files) { filepaths.push(req.files[key].path); }
		
		// TODO: screen file.mime
		
		async.waterfall([
			// write files to mongo
			function(cb) {
				data_controller.writeFilesToMongo(filepaths, cb);
			},
			// pass to worker for processing
			function(mongoIds, cb) {			
				worker_controller.addJob('processFiles', mongoIds);
				cb();
			}
		], function(err) {
			res.send(200);
		});
	});
}
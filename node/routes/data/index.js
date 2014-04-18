var worker_controller = require('../../controllers/worker_controller.js');


module.exports = function(app) {
	app.get('/api/data', function(req, res) {
	
		res.send(200, 'data');
	});
	
	
	
	app.post('/api/file', function(req, res) {
		var files = [];
		for (key in req.files) { files.push(req.files[key]); }
		
		worker_controller.processFiles(files, function(err, jobIds) {
			res.send(200);
		});
		
		/*
		upload_controller.readFilesToDisk(files, function(err, result) {
			res.send(200);
		});*/
	});
}
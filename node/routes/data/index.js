var worker_controller = require('../../controllers/worker_controller.js');
var data_controller = require('../../controllers/data_controller.js');


module.exports = function(app) {
	app.get('/api/data', function(req, res) {
	
		res.send(200, 'data');
	});
	
	
	app.post('/api/file', function(req, res) {
		var filepaths = [];
		for (key in req.files) { filepaths.push(req.files[key].path); }
		
		// TODO: screen file.mime
		
		data_controller.writeFilesToMongo(filepaths, function(err, mongoIds) {
			if (err) return res.json(400, err);
			
			res.json(200, { ids: mongoIds });
		});

	});
}
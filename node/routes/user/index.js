var user_controller = require('../../controllers/user_controller.js');

/**
 *  Route middleware to ensure user is authenticated.
 */
/*
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}*/

// Define a middleware function to be used for every secured routes 
var auth = function(req, res, next) { 
	if (!req.isAuthenticated()) res.send(401); 
	else next();
};
// - See more at: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs



module.exports = function(app) {
	app.post('/user', function(req, res) {
		user_controller.signup(req, res, function(err, result) {
			if (err) {
				console.log('### Error signing up: ' + JSON.stringify(err));
				return res.send(400, JSON.stringify(err));
			}
			res.send(200, JSON.stringify(result));
		});
	});
	
	app.post('/session', function(req, res) {
		user_controller.login(req, res, function(err, result) {
			if (err) return res.send(400, JSON.stringify(err));
			
			console.log('### RESULT: ' + JSON.stringify(result));
			console.log('### REQUSER: ' + JSON.stringify(req.user));
			
			res.send(200, JSON.stringify(result));
		});
	});
	
	// returns serialised user if logged in, or null
	app.get('/session', function(req, res) {
		console.log('### USER IS: ' + req.user);
	
		if (req.user) return res.json(req.user);
		res.json(null);
	});
	
	
	app.delete('/session', function(req, res) {
		console.log('## USER WAS: ' + JSON.stringify(req.user));
		/*
		if (req.user) {
			req.logout();
			res.send(200);
		} else {
			res.send(400, "Not logged in");
		}*/
		req.logout();
		return res.send(200, null);
	});
}
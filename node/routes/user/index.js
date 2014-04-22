var user_controller = require('../../controllers/user_controller.js');


var db_pg = require('../../models/index.js').pg;
var User = db_pg.User;
var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  }, function(username, password, done) {
  	//console.log('### passport is authenticating User');
  	User.authenticate(username, password, done);
  }
));

/**
 *  Route middleware to ensure user is authenticated.
 */
/*
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}*/

/*
// Define a middleware function to be used for every secured routes 
var auth = function(req, res, next) { 
	if (!req.isAuthenticated()) res.send(401); 
	else next();
};
// - See more at: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
*/


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
	
	app.post('/session',
		passport.authenticate('basic', { session: false }),
		function(req, res) {
			var result = {};
			
			if (!req.user) {
				result.success = false;
				result.message = 'Invalid email or password';
			//return res.send(200, JSON.stringify(result));
			} else {
				result.success = true;
				result.user = req.user;
			}
			res.json(result);			
	});
	
	//app.post('/session', function(req, res) {
	//	res.send(200);
		/*
		user_controller.login(req, res, function(err, result) {
			if (err) return res.send(400, JSON.stringify(err));
			
			
			res.send(200, JSON.stringify(result));
		});*/
	//});
	
	// returns serialised user if logged in, or null
	/*
	app.get('/session', function(req, res) {
		console.log('### USER IS: ' + req.user);
	
		if (req.user!=null && req.user!=undefined) return res.json(200, req.user);
		res.send(200, null);
	});
	
	
	app.delete('/session', function(req, res) {
		req.logout();
		res.send(200);
		// ! want to logout regardless of success
	});*/
}
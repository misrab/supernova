var user_controller = require('../../controllers/user_controller.js');


var db_pg = require('../../models/index.js').pg;
var User = db_pg.User;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;


passport.use(new BasicStrategy(
  {
    usernameField: 'email',
    passwordField: 'hash'
  }, function(username, password, done) {
  	//console.log('### passport is authenticating User');
  	User.authenticateHash(username, password, done);
  	
  }	
));
passport.use(new LocalStrategy(
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
	
	/*
	app.get('/moo',
		passport.authenticate('basic', { session: false }), function(req, res) {
			res.send(200, 'foo');
		});*/
	
	app.post('/session',
		passport.authenticate('local', { session: false }),
		function(req, res) {
			var result = {};
			
			if (!req.user) {
				result.success = false;
				result.message = 'Invalid email or password';
			//return res.send(200, JSON.stringify(result));
			} else {
				result.success = true;
				result.user = {
					id:		req.user.id,
					email:	req.user.email,
					hash:	req.user.hash
				};
			}
			res.json(result);			
	});

}
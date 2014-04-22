var async = require('async');
var crypto = require('crypto');

//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var db_pg = require('../models/index.js').pg;
var User = db_pg.User;


function signup(req, res, next) {
	
	// check email and password not null
	if (!req.body.email || !req.body.password) {
		return next(null, { success: false, message: 'Email and password are required' });
		//var error = new Error('Email and password are required');
		//return next(error);
	}
	
	async.waterfall(
	[
		//builds user
		function(callback){

			
			var email = req.body.email.trim();
			
			// create secret
			var secret = crypto.randomBytes(20).toString('hex');
			
			//console.log('###1 secret: ' + secret);
			//var pat = /[^@]*/i;
			//var username = pat.exec(email);
			//username = username[0];

			var newUser = User.build({ email: 	email });
			newUser.setPassword(req.body.password, function(err, newUser) {
				callback(err, newUser);
			});
		},

		//saves user
		function(newUser, callback){
		
			newUser.save().success(function(user){
				if(!user){
					var errorMessage = "## Error inserting user into database on signup";
					var insertionError = new Error(errorMessage);
					return callback(insertionError);
				}
				return callback(null, user);
			}).error(callback);
		}		
	], function(err, user) {
		var result = {};
		result.code = null;
		if (err && err.code === "23505") {
			result.success = false;
			result.message = 'Email address already exists';
			return next(null, result);
			//return res.send(200, JSON.stringify(result));
		} else if (err) {
			return next(err, null);
		}
		
		// success
		result.success = true;
		return next(null, result);
	});
};

/*
function login(req, res, next) {
	console.log('## AUTHING');
	passport.authenticate('local', {session:false}, function(err, user, info) {			
		var result = {};
		console.log('## start');
		// dealing with these together
		if (err || !user) {
			result.success = false;
			result.message = 'Invalid email or password';
			return next(null, result);
			//return res.send(200, JSON.stringify(result));
		}
		
		result.success = true;
		result.user = req.user;
		next(null, result);
	})(req, res, function() {
		console.log('#ND');
	});
};
*/
/*
function login(req, res, next) {
	async.waterfall([
		// checks to see if user is authenticated
		function(callback){
			passport.authenticate('local', function(err, user, info) {			
				return callback(err, user);
			})(req, res, callback);
		}, 
		//logs user in
		function(user, callback){
			// to avoid serializing
			if (!user) return callback(null, null);
			
			req.login(user, function(err) {
				if (err) return callback(err);
				return callback(null, user);
			});
		}
	], function(err, user){
		var result = {};
		
		// dealing with these together
		if (err || !user) {
			result.success = false;
			result.message = 'Invalid email or password';
			return next(null, result);
			//return res.send(200, JSON.stringify(result));
		}
		
		result.success = true;
		result.user = req.user;
		next(null, result);
	});
};
*/


// for user to change attribute, i.e. email, password
// expect object.userId + object.email || object.oldPassword + object.newPassword
function changeAttribute(user, object, next) {
	async.waterfall([
		// find user/publisher
		function(cb) {
			Publisher.find(object.userId).success(function(pub) {
				cb(null, pub);
			}).error(cb);
		},
		// modify
		function(publisher, cb) {		
			if (!publisher) {
				var err = new Error('No publisher found');
				return cb(err);
			}
			
			// change email
			if (object.email) {
				
				publisher.email = object.email;
				publisher.save().success(function(){
					return cb(null, publisher);
				}).error(cb);
			// change password: check then change
			} else {
				// check
				user.verifyPassword(object.oldPassword, function(err, answer) {
					if (err) return cb(err);
					if (answer==false) {
						var err = new Error('Invalid password');
						return cb(err);
					}
					// all ok, change password
					publisher.setPassword(object.newPassword, function(err, publisher) {
						if (err) return cb(err);
						// save
						publisher.save().success(function(){
							return cb(null, publisher);
						}).error(cb);
					});		
				});
				
			}
		}
	], next);
};

module.exports = {
	signup:				signup
	//login:				login
};
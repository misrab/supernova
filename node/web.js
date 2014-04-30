// set up ========================

var express  = require('express')
	, https = require('https')
	, fs = require('fs')
	, passport = require('passport')
	, url = require('url')
	, db_pg = require('./models').pg;



// configuration =================
var app = express();

//app.set('views', __dirname + '/public/views');

app.set('views', __dirname + '/public/angular');
//app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
	
	// Passport and Sessions
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(app.router);
});



// routes ======================================================================

require('./routes')(app);

// listen (start app with node server.js) ======================================
var clearDB = null;
if (process.env.NODE_ENV=='development') {
	// next(err)
	clearDB = function(next) {
		db_pg.sequelize.drop().complete(next);
		//next(null);
	};
}
else if (process.env.NODE_ENV=='staging') {
	clearDB = function(next) { next(null); };
} else {
	//!!! PRODUCTION, CAREFUL !!!
	clearDB = function(next) { next(null); };
}


// SSL
var options = {
    key: 	fs.readFileSync('./node/ssl/server-key.pem').toString(),
    cert: 	fs.readFileSync('./node/ssl/server-cert.pem').toString()
};


clearDB(function(err) {
	db_pg.sequelize.sync().complete(function(err) {
		if (err) { throw err }
		else {
			console.log ('### Succeeded connected to: ' + db_pg.url + ' ###');
			var port = process.env.NODE_ENV=='development' ? 8080 : process.env.PORT;
			
			https.createServer(options, app).listen(port, function () {
			  	console.log('### Environment is: ' + process.env.NODE_ENV);
				console.log('### Listening on ' + port);
			});
			/*
			app.listen(port, function() {
				console.log('### Environment is: ' + process.env.NODE_ENV);
				console.log('### Listening on ' + port);
			});*/
		}
	})
});
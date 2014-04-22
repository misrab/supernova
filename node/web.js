// set up ========================

var express  = require('express')
	, passport = require('passport')
	, url = require('url')
	, db_pg = require('./models').pg;
	//, RedisStore = require( "connect-redis" )(express)
	//, db_redis = require('./models').redis;
	//, redis = require('redis');


// redis for session store ===========================
/*
if (process.env.REDISTOGO_URL) {
	var redisUrl = url.parse(process.env.REDISTOGO_URL);
	var redisAuth = redisUrl.auth.split(':');
	var redisClient = new RedisStore({
                          host: redisUrl.hostname,
                          port: redisUrl.port,
                          db: redisAuth[0],
                          pass: redisAuth[1],
                          client: db_redis.client
                        });
} else {
	var redisClient = new RedisStore({
                          host: 'localhost',
                          port: 6379,
                          client: db_redis.client
                        });
}

*/



// JOBS ======
//var worker = require('./controllers/worker_controller.js');
//worker.addJob('meowJob', 'meowSource');



// configuration =================
var app = express();

app.set('views', __dirname + '/public');
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

// Passport and Sessions
//app.use(express.cookieParser());
//app.use(express.bodyParser());
//app.use(express.methodOverride());

/*
app.use(express.session({ 
  store: redisClient 
  , secret: 'teafortwo'
  }, function() {
    app.use(app.router);
  }));*/

//app.use(passport.initialize());
//app.use(passport.session());







// routes ======================================================================

require('./routes')(app);

// listen (start app with node server.js) ======================================
var clearDB = null;
if (process.env.NODE_ENV=='development') {
	// next(err)
	clearDB = function(next) {
		next(null);
		
		// drop
		/*
		db_mongo.Neuron.remove({}, function(err) {
			console.log('Neurons removed') 
			// drop sequelize
			db_pg.sequelize.drop().complete(next);
		});
		*/
	};
}
else if (process.env.NODE_ENV=='staging') {
	clearDB = function(next) { next(null); };
} else {
	//!!! PRODUCTION, CAREFUL !!!
	clearDB = function(next) { next(null); };
}

clearDB(function(err) {
	db_pg.sequelize.sync().complete(function(err) {
		if (err) { throw err }
		else {
			console.log ('### Succeeded connected to: ' + db_pg.url + ' ###');
			var port = process.env.NODE_ENV=='development' ? 8080 : process.env.PORT;
			app.listen(port, function() {
				console.log('### Environment is: ' + process.env.NODE_ENV);
				console.log('### Listening on ' + port);
			});
		}
	})
});
// set up ========================

var express  = require('express')
	, passport = require('passport')
	, url = require('url')
	, RedisStore = require( "connect-redis" )(express)
	, db_pg = require('./models').pg;


// redis ===========================

/*
 *	Environment
 */

function createRedisClient() {
	if (process.env.REDISTOGO_URL) {
		var redisUrl = url.parse(process.env.REDISTOGO_URL);
		var redisAuth = redisUrl.auth.split(':');
		var client = require("redis").createClient(redisUrl.port, redisUrl.hostname);
		client.auth(redisAuth[1]);
	} else {
		var client = require("redis").createClient(6379, 'localhost');
	}
	return client;
}


var client = createRedisClient();
if (process.env.REDISTOGO_URL) {
	// TODO: redistogo connection
	// redis store
	var redisUrl = url.parse(process.env.REDISTOGO_URL);
	var redisAuth = redisUrl.auth.split(':');
	
	var redisClient = new RedisStore({
                          host: redisUrl.hostname,
                          port: redisUrl.port,
                          db: redisAuth[0],
                          pass: redisAuth[1],
                          client: client
                        });
} else {
	//var redis = require("redis").createClient(6379, 'localhost');
	var redisClient = new RedisStore({
                          host: 'localhost',
                          port: 6379,
                          client: client
                        });
}


// configuration =================
var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'html');

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

// Passport and Sessions
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ 
  store: redisClient 
  , secret: 'teafortwo'
  }, function() {
    app.use(app.router);
  }));
app.use(passport.initialize());
app.use(passport.session());


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
			console.log("### process.env.PORT: " + process.env.PORT);
			var port = process.env.PORT || 5000;
			app.listen(port, function() {
				console.log('### Environment is: ' + process.env.NODE_ENV);
				console.log('### Listening on ' + port);
			});
		}
	})
});

//var port = process.env.PORT || 5000;
//app.listen(port);
//console.log("App listening on port 5000");
var redis = require('redis')
	, url = require('url');

/*
 *	Create redis client
 */

function createRedisClient() {
	if (process.env.REDISTOGO_URL) {
		var redisUrl = url.parse(process.env.REDISTOGO_URL);
		var redisAuth = redisUrl.auth.split(':');
		var client = redis.createClient(redisUrl.port, redisUrl.hostname);
		client.auth(redisAuth[1]);
	} else {
		var client = redis.createClient(6379, 'localhost');
	}
	return client;
}
var client = createRedisClient();




module.exports = {
	client:	client
}
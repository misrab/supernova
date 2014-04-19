var pg = require('./pg');
var redis = require('./redisClient'); // avoiding calling it 'redis' like the module
var mongo = require('./mongo');

exports.pg = pg;
exports.redis = redis;
exports.mongo = mongo;
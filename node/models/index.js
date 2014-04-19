var pg = require('./pg');
var redis = require('./redisClient'); // avoiding calling it 'redis' like the module
//var mongodb = require('./mongodb');

exports.pg = pg;
exports.redis = redis;
//exports.mongodb = mongodb;
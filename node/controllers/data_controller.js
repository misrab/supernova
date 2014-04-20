var async = require('async');


var crypto = require('crypto');
var knox = require('knox');
var client = knox.createClient({
    key: 	process.env.AWS_ACCESS_KEY_ID
  , secret: process.env.AWS_SECRET_ACCESS_KEY
  , bucket: process.env.S3_BUCKET_NAME
});



// takes array of string 'filepaths'
// next(err, urls) urls array of file locations
function writeFilesToStore(userId, files, next) {
	var urls = [];
	
	//for (key in req.files) { filepaths.push(req.files[key].path); }
	
	async.each(files, function(file, cb) {
	
		var filepath = file.path;
		var filename = file.name;
		var fileExt = filename.split('.').pop();
		var newPath = '/files/' + userId + '/' + crypto.randomBytes(128).toString('hex') + '.' + fileExt;
		//crypto.randomBytes(48, function(ex, buf) {
  		//var token = buf.toString('hex');
		//});
		
		client.putFile(filepath, newPath, function(err, res) {
			/*
			console.log('## READ:' + filepath);
			console.log('## RESULT:' + res.statusCode);
			console.log('## NEWPATH ' + newPath);
			for (k in res) { console.log('## RES: ' + k); } */
		
			urls.push(newPath);
		 	 // Always either do something with `res` or at least call `res.resume()`.
		  	res.resume();
		  	cb();
		});
	}, function(err) {
		if (err) return next(err);
		next(null, urls);
	});
};


module.exports = {
	writeFilesToStore:	writeFilesToStore
};
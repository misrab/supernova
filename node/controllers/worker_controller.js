var async = require('async');


// next(err, jobIds)
function processFiles(files, next) {

	next();
}

/*
// cb(err)
function writeFileToDisk(file, cb) {
	fs.rename(file.path, '/tmp/meow');
	cb();
}


// next(err, result)
// result should be array of file paths
function readFilesToDisk(files, next) {	
	console.log('###startijg');
	async.each(files, function(file, cb) {
		writeFileToDisk(file, cb);
	}, function(err) {
		next();
	});
}*/

module.exports = {
	processFiles:		processFiles
	//readFilesToDisk:	readFilesToDisk
}
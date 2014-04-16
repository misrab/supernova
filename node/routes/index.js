module.exports = function(app) {
	// APIS
	require('./data')(app);
	
	// ANGULAR APP AS DEFAULT
	
	//app.get('/*', function(req, res) {
		//res.sendfile('/public/angular/index.html');
		//res.send('moed');
		//res.sendfile('/angular/index.html');
	//});
}
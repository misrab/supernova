


module.exports = function(app) {
	// APIS
	require('./data')(app);
	require('./user')(app);
	
	
	// ANGULAR APP AS DEFAULT
	app.get('*', function(req, res) {
		res.render('index.html');
	});
}
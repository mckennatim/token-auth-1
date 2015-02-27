

module.exports = function(app){
	app.get('/dog/', function(req, res) {
		res.jsonp('You are a dog, Uli')
	});	
	app.post('/api/authenticate/:name', 
		passport.authenticate('localapikey', {session: false}),
		function(req, res) {
			console.log(req.params)
			console.log('just sent body in /api/authenticate')
			if (req.params.name==req.user.name){
				var payload = {name: req.user.name};
				var token = jwt.encode(payload, secret);
				var name =jwt.decode(token, secret);
				console.log(name)
				res.jsonp({message: 'token here', token: token});
				console.log(token);     
			}else {
				res.jsonp({message: 'apikey does not match user'});
			}
		});	
}
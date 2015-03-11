var nodmod = './node-token-auth/node_modules/'
var express = require(nodmod+'express');
var router = express.Router();
var User = require('./node-token-auth/reg/user');
// var Server = require(nodmod+'mongodb').Server
// var MongoClient = require(nodmod+'mongodb').MongoClient
// var db
// var mongoClient = new MongoClient(new Server('localhost', 27017));
// mongoClient.open(function(err, mongoClient) {db = mongoClient.db("stuffDb");})


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){
	router.get('/dog/', function(req, res) {
		res.jsonp('You are a dog, Uli')
	});	
	router.get('/api/users', function(req, res) {
		console.log('in api/users uu')
		User.find({}, function(err, items) {
			if(err){res.jsonp(err)}else{res.jsonp(items)};
		});
	});	

	return router;
}
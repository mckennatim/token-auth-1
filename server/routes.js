var nodmod = './node-token-auth/node_modules/'
var express = require(nodmod+'express');
var router = express.Router();
var _ = require(nodmod+'underscore');
var User = require('./node-token-auth/reg/user');
var dbase = require('./node-token-auth/cfg').db().db;
var cons = require(nodmod+ 'tracer').console();
var db;
var Server = require(nodmod+'mongodb').Server
var MongoClient = require(nodmod+'mongodb').MongoClient
var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {db = mongoClient.db(dbase);})

var isRightList = function(lists, list){
        return _.find(lists, function(obj) { return obj.lid == list })
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

	router.get('/api/lists/:lid', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res){ 
			console.log('in getList by lid');
			var lid = req.params.lid;
			cons.log(lid);  
			cons.log (req.user)            
			if (isRightList(req.user.lists, lid)) {
				cons.log('isRightList')
				db.collection('lists', function(err, collection) {
					collection.findOne({lid:lid}, function(err, items) {
						if(err){res.jsonp(err)}else{
							console.log('this got found')
							console.log(items.shops)
							res.jsonp(items)
						};
					})
				})      
			} else {
				res.jsonp({message: 'that is not one of your lists', lists: req.user.lists})
			}
		}
	)	
	router.get('/api/users/:name', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res) {
			console.log('in find user by name');
			console.log(req.params);
			var name = req.params.name;
			db.collection('users', function(err, collection) {
				collection.findOne({name:name},function(err, items) {
					console.log(items);
					res.jsonp({message:'success', items:items});
				});
			});
		}
	);
	return router;
}
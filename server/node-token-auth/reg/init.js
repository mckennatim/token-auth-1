var LocalStrategy = require('passport-localapikey').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jwt-simple');
var cfg = require('../cfg').cfg();
var secret = cfg.secret;

var User = require('./user');
// User.find().toArray(function(err, items) {
// 	console.log(err);
// 	console.log(items)
// }

module.exports = function(passport) {
	passport.use(new LocalStrategy(
		function(apikey, done) {
			// asynchronous verification, for effect...
			process.nextTick(function() {
				User.findOne({apikey: apikey}, function(err, items) {
					if (items == null) {
						return done(null, null);
					} else if (items.apikey === apikey) {
						return done(null, items);
					}else if(!items){
						return done(null, false, {
							message: 'Unknown api ' + apikey
						});	
					}					
					if (items.apikey != apikey) {
						return done(null, false, {
							message: 'wrong apikey'
						});
					}
					return done(null, null);
				});				
			});
		}
	));


	passport.use(new BearerStrategy({},
		function(token, done) {
			// asynchronous validation, for effect...
			process.nextTick(function() {
				// Find the user by token.  If there is no user with the given token, set
				// the user to `false` to indicate failure.  Otherwise, return the
				// authenticated `user`.  Note that in a production-ready application, one
				// would want to validate the token for authenticity.
				if (token) {
					try {
						var user = jwt.decode(token, secret);
						var name = user.name;
						User.findOne({name: name}, function(err, items) {
							if (items.name === name) {
								return done(null, items);
							} else if(!items){
								return done(null,false)
							}
							return done(null, null);
						});
					} catch (err) {
						return done(err, null);
					}
				}				
			});
		}
	));
}

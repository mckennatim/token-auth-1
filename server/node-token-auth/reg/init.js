var nodemailer = require('nodemailer')
var assert =require('assert')
var myut = require('../util/myutil')
var gmailCred =require('../util/config').gmail();
var jwt = require('jwt-simple');
var LocalStrategy = require('passport-localapikey').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

/*-----------------------------setup passport-----------------------------------*/
module.exports = function(passport){
	passport.serializeUser(function(user, done) {
	    done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	    findById(id, function (err, user) {
	        done(err, user);
	        //console.log(user)
	    });
	});

	passport.use(new LocalStrategy(
	    function(apikey, done) {
	        // asynchronous verification, for effect...
	        process.nextTick(function () {
	            findByApiKey(apikey, function(err, user) {
	                if (err) { return done(err); }
	                if (!user) { return done(null, false, { message: 'Unknown api ' + apikey }); }
	                if (user.apikey!=apikey) { return done(null, false, { message: 'wrong apikey' }); }
	                return done(null, user);
	            })
	        });
	    }
	)); 

	passport.use(new BearerStrategy({
	    },
	    function(token, done) {
	        // asynchronous validation, for effect...
	        process.nextTick(function () {     
	            // Find the user by token.  If there is no user with the given token, set
	            // the user to `false` to indicate failure.  Otherwise, return the
	            // authenticated `user`.  Note that in a production-ready application, one
	            // would want to validate the token for authenticity.
	            findByToken(token, function(err, user) {
	                if (err) {
	                        //console.log(err)
	                        return done(err); 
	                }
	                if (!user) { return done(null, false); }
	                return done(null, user);
	            })
	        });
	    }
	));	
}

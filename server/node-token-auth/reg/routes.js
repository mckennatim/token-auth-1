var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var fs = require('fs');
var User = require('./user');
var cons = require('tracer').console();
var secret = require('../cfg').cfg().secret

/*-----------------------------setup mailer-----------------------------------*/
var nodemailer = require('nodemailer')
var gmailCred =require('../cfg').gmail();
var smtpTransport = nodemailer.createTransport("SMTP",gmailCred);  
console.log(smtpTransport.options.service)

var blankUser= {name: '', email: '', lists:[], role:'', timestamp: 1, apikey: ''};

emailKey =function(items, callback){
	fs.writeFile("node-token-auth/key", items.apikey, function(err){
	    if(err) {
	        cons.log(err);
	    } else {
	        cons.log("The file was saved!");
	    }		
	})
    console.log('in emailKey')
    console.log(smtpTransport.options.service)
    var mailOptions = {
        from: "Stuff2Get <mckenna.tim@gmail.com>", // sender address
        to: items.email, // list of receivers
        subject: "apikey", // Subject line
        text: "Your apikey for stuff2get is: " +items.apikey + "Return to the web page and enter your apikey to complete registration for your device", // plaintext body
        html: "<b>Your apikey for stuff2get is: " +items.apikey + "</b><p>Return to the web page and enter your apikey to complete registration for your device </b></p>" // html body
    }
    var ret=""
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
                console.log(error);
                ret = error;
        }else{
                console.log("Message sent: " + response.message);
                ret = {message: 'check your email and come back'} 
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
        console.log(ret)
        callback(ret);
    });
}

var createRandomWord = function(length) {
	var consonants = 'bcdfghjklmnpqrstvwxyz',
		vowels = 'aeiou',
		rand = function(limit) {
			return Math.floor(Math.random() * limit);
		},
		i, word = '',
		length = parseInt(length, 10),
		consonants = consonants.split(''),
		vowels = vowels.split('');
	for (i = 0; i < length / 2; i++) {
		var randConsonant = consonants[rand(consonants.length)],
			randVowel = vowels[rand(vowels.length)];
		word += (i === 0) ? randConsonant.toUpperCase() : randConsonant;
		word += i * 2 < length - 1 ? randVowel : '';
	}
	return word;
}

module.exports = function(passport) {
	router.get('/api', function(req, res) {
		// Display the Login page with any flash message, if any
		res.jsonp('at the root of nothing');
	});
	router.get('/api/isers', function(req, res) {
		console.log('in api/isers uu')
		User.find({}, function(err, docs) {
			res.send(docs);
		});
	});
	router.get('/api/isUser/:name', function(req, res) {
		console.log('in isUser by name');
		var name = req.params.name.toLowerCase();
		console.log(name)
		User.findOne({name: name}, function(err, items) {
			console.log(items)
			if (items != null && items.name == name) {
				console.log('is registered')
				res.jsonp({
					message: ' already registered'
				})
			} else {
				res.jsonp({
					message: ' available'
				});
			}
		});
	});

	router.get('/api/isMatch/', function(req, res) {
		console.log('in isMatch');
		try{
			var name = req.query.name.toLowerCase();
			var email = req.query.email.toLowerCase();
			var apikey = "";
			cons.log(name + ' ' + email)
		}catch(err){
			cons.log(err)
			res.jsonp({message: 'bad query'});
			return;
		}
		var usr = {}
		var comboExists = 0;
		var eitherExists = 0;
		var message = '';
		User.find({name: name, email: email}, function(err, user) {
			if (user.length > 0) {
				usr = user[0];
			}
			cons.log(usr)
			cons.log(user.length)
			comboExists = user.length
			User.find({$or: [{name: name}, {email: email}]}, function(err, oitems) {
				cons.log(oitems)
				cons.log(oitems.length)
				eitherExists = oitems.length >0;
				if (eitherExists && !comboExists) {
					message = 'conflict'
					res.jsonp({message: message})
				} else {
					var upd ={}
					if (!comboExists && !eitherExists) {
						cons.log('neither combo or either exists so available, upserting new user')
						upd = blankUser;
						upd.name = name;
						upd.email = email;
						upd.timestamp = Date.now()
						message = 'available';
						upd.apikey = createRandomWord(24);
						apikey = upd.apikey;
					} else if (comboExists) {
						cons.log('matching combo exists, ')
						if (usr.apikey.length < 10) { //need a new apikey?
							upd.apikey = createRandomWord(24);
							apikey = upd.apikey
							upd.timestamp=Date.now()
						}else {
							apikey=usr.apikey
						}
						message = 'match';
					}
					cons.log(upd)
					cons.log(name)
					User.update({name: name}, upd, {upsert: true}, function(err, result){
						cons.log(result)
						cons.log(err)
						var emu = upd;
						emu.email = email;
						emu.apikey = apikey;
						emailKey(upd, function(ret){
							console.log(ret);
						});
						res.jsonp({message: message, result: result, err:err})
					})
				}
			});
		});
	})

	router.post('/api/authenticate/:name', 
	//passport.authenticate('localapikey', {session: false, failureRedirect: '/api/unauthorized'}),
		passport.authenticate('localapikey', {session: false}),
		function(req, res) {
			console.log(req.params)
			cons.log(req.user)
			console.log('just sent body in /api/authenticate')
			if (req.params.name==req.user.name){
				cons.log('names match')
				var payload = {name: req.user.name};
				var token = jwt.encode(payload, secret);
				var name =jwt.decode(token, secret);
				cons.log(name)
				res.jsonp({message: 'token here', token: token});
				cons.log(token);     
			}else {
				res.jsonp({message: 'apikey does not match user'});
			}
		}
	);
	router.get('/api/account', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res){ 
			console.log('in api/account ') 
			console.log(req.body)
			res.jsonp(req.user)
		}
	);

	return router;
}

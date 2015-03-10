var superagent = require('superagent')
var expect = require('expect.js')
var should = require('should')
var _ = require('underscore')
var jwt = require('jwt-simple');
var fs = require('fs');
var cfg = require('../cfg').cfg();
var secret = cfg.secret

var httpLoc = 'http://localhost:' + cfg.port + '/api/'

describe('superagent:', function() {
	var agent = superagent.agent();
	var name = 'tim7';
	var ucnt = 0;
	var apikey = 'dog';
	var ureg = 'tim';
	var uav = 'fred';
	var token ='';
	var eregtim = 'mckenna.tim@gmail.com';
	var enottim = 'mckenna.nottim@gmail.com';
	it('GET / should be running and return: please select...', function(done) {
			superagent.get(httpLoc)
				.end(function(e, res) {
					//console.log(res.body)
					expect(e).to.eql(null)
					expect(res.body.length).to.be.above(0)
					expect(res.body).to.be.a('string')
					done()
				})
		})
		/*-----------------------------------authentication-----------------------------------------------*/
	describe('signup', function() {
		//before(loginUser(agent));    
		it('gets a [available] for user tim ', function(done) {
			agent
				.get(httpLoc + 'isUser/' + ureg)
				.end(function(e, res) {
					console.log(res.body)
					expect(res.body.message).to.be(' available')
					done()
				})
		})
		it('gets a [available] for user tim and email and creates user', function(done) {
			agent
				.get(httpLoc + 'isMatch/?name=' + ureg + '&email=' + eregtim)
				.end(function(e, res) {
					console.log(res.body)
					expect(res.body.message).to.be('available')
					done()
				})
		})
		it('gets a [conflict] to existing user and wrong email', function(done) {
			agent
				.get(httpLoc + 'isMatch/?name=' + ureg + '&email=f' + eregtim)
				.end(function(e, res) {
					console.log(res.body)
					expect(res.body.message).to.be('conflict')
					done()
				})
		})
	})
	describe('authenticate', function() {
		it('reads apikey from file, expects it to be 24 characters' ,function(done){
			fs.readFile('../node-token-auth/key', 'utf8', function(err, data) {
				if (err) {
					return console.log(err);
				}
				apikey = data
				console.log(apikey)
				expect(data.length).to.be(24)
				done()
			})
		})
		it('POSTs /authenticates w apikey and returns token', function(done) {
			agent
				.post(httpLoc + 'authenticate/' + ureg)
				.send({
					apikey: apikey
				})
				.end(function(e, res) {
					console.log(res.body)
					var payload = {
						name: ureg
					};
					token = jwt.encode(payload, secret);
					expect(res.body.token).to.be(token);
					done();
				})
			}
		)

		it('POSTs fails with 401 for tim with wrong apikey', function(done) {
			agent
				.post(httpLoc + 'authenticate/tim')
				.send({
					apikey: '123457'
				})
				.end(function(e, res) {
					console.log(res.status);
					expect(res.status).to.be(401);
					done();
				})
			}
		)
		it('POSTs fails for tim2 with tim apikey', function(done) {
			agent
				.post(httpLoc + 'authenticate/tim2')
				.send({
					apikey: apikey
				})
				.end(function(e, res) {
					console.log(res.body)
					expect(res.body.token).to.be(undefined);
					expect(res.body.message).to.be('apikey does not match user');
					done();
				})
			}
		)
	})
	describe('users', function() {
		it('GETs succeeds w userinfo from api/account when passed token', function(done) {
			agent
				.get(httpLoc + 'account/')
				.set('Authorization', 'Bearer ' + token)
				.end(function(e, res) {
					console.log(res.body)
					expect(res.body.apikey).to.be(apikey);
					done()
				})
		})
		it('DELETES user tim', function(done){
			agent
				.del(httpLoc + 'users/'+ureg)
				.set('Authorization', 'Bearer ' + token)
				.end(function(e, res) {
					console.log(res.body)
					expect(e).to.eql(null)
					expect(res.body).to.eql(1)
					done()
				})			
		})
	})
})


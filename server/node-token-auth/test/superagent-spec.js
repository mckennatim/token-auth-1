var superagent = require('superagent')
var expect = require('expect.js')
var should = require('should')
var _ = require('underscore')
var cfg = require('../cfg').cfg();

var httpLoc = 'http://localhost:'+cfg.port +'/api/'

describe('superagent:', function(){
  var agent = superagent.agent();
  var name = 'tim7';
  var ucnt = 0;
  var listId = 'Jutebi';
  var apikey='Natacitipavuwunexelisaci';
  var otherListId = 'Vegada';
  var listShops = 'groceries';
  it('GET / should be running and return: please select...', function(done){
    superagent.get(httpLoc)
      .end(function(e, res){
        //console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body).to.be.a('string')
        done()
      })    
  })
  describe('users', function(){
    it('POSTs fails for tim2 with tim apikey',function(done){
      agent
        .post(httpLoc+ 'authenticate/tim2')
        .send({apikey:apikey})
        .end(function(e,res){
          console.log(res.body
            )
          expect(res.body.token).to.be(undefined);
          expect(res.body.message).to.be('apikey does not match user');
          done();
        })
    })
    it('GETs succeeds w userinfo from api/account when passed token', function(done){
      agent
        .get(httpLoc + 'account/')
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.apikey).to.be(apikey);
          done()
        })
    })    
    it('GETs succeeds api/lists/Jutebi when passed token', function(done){
      agent
        .get(httpLoc+'lists/'+listId)
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')        
        .end(function(e,res){
          //console.log(res.body)
          expect(res.body.lid).to.be('Jutebi');
          done()
        })
    })        
    it('GETs fails when api/lists/Jutebidog is not in user.lists w/token ', function(done){
      agent
        .get(httpLoc+'lists/'+listId+'dog')
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')        
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.message).to.be('that is not one of your lists');
          done()
        })
    })        
   it('GETs fails with 500 when api/lists/Jutebi i has a bad token ', function(done){
      agent
        .get(httpLoc+'lists/'+listId+'dog')
        .set('Authorization', 'Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')        
        .end(function(e,res){
          console.log(res.body)
          expect(res.status).to.be(500);
          done()
        })
    })
})   
/*----------------------------------------------------------------------------------*/
  describe('authentication', function(){
    var ureg='tim';
    var uav='fred';
    var eregtim = 'mckenna.tim@gmail.com';
    var enottim = 'mckenna.nottim@gmail.com';
    //before(loginUser(agent));    
    it('POSTs /authenticates w apikey and returns token',function(done){
      agent
        .post(httpLoc + 'authenticate/tim')
        .send({apikey:apikey})
        .end(function(e,res){
          console.log(res.body )
          expect(res.body.token).to.be('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs');
          done();
        })
    })

    it('POSTs fails with 401 for tim with wrong apikey',function(done){
      agent
        .post(httpLoc + 'authenticate/tim')
        .send({apikey:'123457'})
        .end(function(e,res){
          console.log(res.status);
          expect(res.status).to.be(401);
          done();
        })
    })

    it('gets a [conflict] to existing user and email', function(done){
      agent
        .get(httpLoc+'isMatch/?user='+ureg+'&email=f'+eregtim)
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.message).to.be('bad query')
          done()
        })
    })
    it('gets a [match] to existing user and email', function(done){
      agent
        .get(httpLoc+'isMatch/?name='+ureg+'&email='+eregtim)
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.message).to.be('match')
          done()
        })
    }) 
  })  
})
/*----------------------------------------------------------------------------------*/

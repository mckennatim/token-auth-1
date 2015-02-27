var superagent = require('superagent')
var expect = require('expect.js')
var should = require('should')
var _ = require('underscore')
var myut = require('../util/myutil.js');

var httpLoc = 'http://localhost:3000/api/'

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
        .post('http://localhost:3000/api/authenticate/tim2')
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
        .get('http://localhost:3000/api/account/')
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
          console.log(res.body)
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
    it ('GETs tim user record when token is good', function(done){
       agent
        .get(httpLoc+'users/tim')
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')        
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.items.name).to.be('tim');
          done()
        })       
    })  
    it('DELs users/:name from users->success=1', function(done){
      superagent.del(httpLoc+'users/'+name)
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    }) 
    it('GETs {} if users/:tim7 doesnt exist', function(done){
      superagent.get(httpLoc+'users/'+name)
        .end(function(e,res){
          //console.log(res.body)
          expect(res.body.items).to.eql(null)
          done()
        })
    })    
    it('GETs all users and counts em', function(done){
      superagent.get(httpLoc+'users')
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.be.above(0)
          expect(res.body).to.be.an('array')
          //possible util 
          var listOfUsers= res.body.map(function (item){return item.name});
          //console.log(listOfUsers);
          ucnt = listOfUsers.length;
          //console.log(ucnt);
          done()
        })
    })
    it('GETs isUser/:tim7 is available', function(done){
      superagent.get(httpLoc+'isUser/'+name)
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.message).to.eql(' available')
          done()
        })
    })
    it('POSTs a new /user/:tim7 -> full array of objects ', function(done){
      superagent.post(httpLoc+'users')
        .send({name:name, email:"tim@sitebuilt.net", defaultList: 0, lists:[{"lid": "Kidoju", "shops": "hardware"}],role:'user', timestamp:1399208688, apikey:'Qemavohegoburuxosuqujoga' })
        .end(function(e,res){
          console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.eql(1)
          expect(res.body[0]._id.length).to.eql(24)
          expect(res.body[0].name).to.be(name)
          done()
        })    
    })
    it('GETs all users expecting the count to go up', function(done){
      superagent.get(httpLoc+'users')
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.be.above(0)
          expect(res.body).to.be.an('array')
          //possible util 
          var listOfUsers= res.body.map(function (item){return item.name});
          //console.log(listOfUsers);
          expect(listOfUsers.length).to.be(ucnt+1);
          //console.log(listOfUsers.length);
          done()
        })
    })
       
    it('GETs a users/:tim7', function(done){
      superagent.get(httpLoc+'users/'+name)
        .end(function(e,res){
          //console.log(res.body)
          expect(res.body.items.name).to.eql(name)
          done()
        })
    })

    it('GETs a users/id/:id', function(done){
      superagent.get(httpLoc+'users/id/4')
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.id).to.eql(4)
          done()
        })
    })
       
    it('GETs username is already registered for isUser/:tim7', function(done){
      superagent.get(httpLoc+'isUser/'+name)
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.message).to.eql(' already registered')
          done()
        })
    })
    it('rejects POST of duplicate user/:tim7 ->11000', function(done){
      superagent.post(httpLoc+'users')
        .send({name:name, email:"tim@sitebuilt.net", lists:[], apikey: ""})
        .end(function(e,res){
          console.log(res.body.code)
          expect(res.body.code).to.eql(11000)
          done()
        })    
    })

    // it('PUTs an existing :list on /users/:name/:listId->list', function(done){
    //   superagent.put(httpLoc+'users/'+name+'/'+listId)
    //     .send()
    //     .end(function(e, res){
    //       console.log(res.body)
    //       expect(e).to.eql(null)
    //       expect(typeof res.body).to.eql('object')
    //       expect(res.body.lid).to.eql(listId) 
    //       expect(res.body.shops).to.be(listShops)       
    //       done()
    //     })
    // })
    // it('rejects a PUT of new :list on /users->list already included', function(done){
    //   superagent.put(httpLoc+'users/'+name+'/'+listId)
    //     .send()
    //     .end(function(e, res){
    //       //console.log(res.body)
    //       expect(e).to.eql(null)
    //       expect(res.body).to.be('list already included')       
    //       done()
    //     })
    // })    
    // it('reject a PUT of :list for user -> null list with that id', function(done){
    //   superagent.put(httpLoc+'users/'+name+'/'+otherListId)
    //     .send()
    //     .end(function(e, res){
    //       //console.log(res.body)
    //       expect(e).to.eql(null)
    //       expect(res.body).to.be('null list with that lid')       
    //       done()
    //     })
    // })         
  })

/*----------------------------------------------------------------------------------*/
  describe('lists', function(){
    var newListId;
    var shops = 'testShop2';

    it('POSTs (creates) a new list',function(done){
      superagent.post(httpLoc+'lists/'+shops)
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs') 
        .send()
        .end(function(e,res){
          console.log(res.body)
          newListId=res.body.lid
          expect(res.body.shops).to.eql(shops)
          done()
        })
    })

    it('DELs a list by :lid', function(done){
      console.log(newListId)
      superagent.del(httpLoc+'lists/'+newListId)
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')       
        .end(function(e, res){
          console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.name).to.eql('tim')
          done()
        })      
    })
    it('PUTs updates /list timestamp', function(done){
      superagent.put(httpLoc+'lists/'+listId)
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')        
        .send({timestamp:Date.now()})
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    })
    it('PUTs updates /user/tim lists, removing testShop2', function(done){
      superagent.put(httpLoc+'users/tim')
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')        
        .send({$pull: {lists: {shops: 'testShop2'}}})
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    })
    it('GETs a list that is not there', function(done){
      superagent.get(httpLoc+'lists/'+newListId)
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs')        
        .end(function(e, res){
          console.log(res.body)
          done()
        })
    })
    it('PUTS api/user/Jutebi listinfo in user/tim7 and user in lists', function(done){
      superagent.put(httpLoc+'user/Jutebi/')
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltNyJ9.puFMhr9kjiRfyRzlYDLdD7rOveQO5KgR6TkDqLmMYk0')
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.shops).to.eql('groceries')
          done();
        })
    })
    it('fails to PUT api/user/JutebZ listinfo in user/tim7 and user in lists', function(done){
      superagent.put(httpLoc+'user/JutebZ/')
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltNyJ9.puFMhr9kjiRfyRzlYDLdD7rOveQO5KgR6TkDqLmMYk0')
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.message).to.eql('that list doesnt exist')
          done();
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
        .post('http://localhost:3000/api/authenticate/tim')
        .send({apikey:apikey})
        .end(function(e,res){
          console.log(res.body )
          expect(res.body.token).to.be('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGltIn0.LmoK1Nr8uA4hrGr25L2AlKXs6U832Z_lE6JGznHJfFs');
          done();
        })
    })

    it('POSTs fails with 401 for tim with wrong apikey',function(done){
      agent
        .post('http://localhost:3000/api/authenticate/tim')
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
          expect(res.body.message).to.be('conflict')
          done()
        })
    })
    it('gets a [match] to existing user and email', function(done){
      agent
        .get(httpLoc+'isMatch/?user='+ureg+'&email='+eregtim)
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.message).to.be('match')
          done()
        })
    })
    it('gets available -> posts/creates user expected to return user rec for [timz] ', function(done){
      agent
        .get(httpLoc+'isMatch/?user='+ureg+'z&email=z'+eregtim)
        .end(function(e,res){
          console.log(res.body)
          expect(res.body.message).to.be('available')
          done()
        })
    })
    it('DELs users/:name from users->success=1', function(done){
      superagent.del(httpLoc+'users/'+ureg+'z')
        .end(function(e, res){
          console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    }) 
  })  
})
/*----------------------------------------------------------------------------------*/

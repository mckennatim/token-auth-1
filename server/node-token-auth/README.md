#token-auth-server

Uses node express passport and mongoose.

##config

Rename cfg-blank.js to cfg.js and fill out database, port, jwt secret and smtp mailer credentials.

from /server/node-token-auth  directory  run

	npm install 

start mongod if it is not running

       mongod

from /server run

	node server

test

      cd node-token-auth
      mocha

make sure the client is listening on the same port as you set above

	app.constant('cfg', {
	    serverUrl: 'http://localhost:3002/api/',
	    
Start up the client and try adding some users      

#!/usr/bin/env node
var app = require('./node-token-auth/app');
var cfg = require('./node-token-auth/cfg').cfg();


app.set('port', process.env.PORT || cfg.port);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

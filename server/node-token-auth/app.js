var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var db = require('./cfg').db();
//var mongoose = require('mongoose');
// Connect to DB
//mongoose.connect(db.url);

var app = express();

app.engine('.html', require('ejs').renderFile);
// view engine setup
app.set('views', __dirname + '/views');
// var ejs = require('ejs')
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(passport.initialize());

// Initialize Passport
var initPassport = require('./reg/init');
initPassport(passport);

var routes = require('./reg/routes')(passport);
app.use('/', routes);
var myroutes = require('../routes')(passport);
app.use('/', myroutes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}



module.exports = app;

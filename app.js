var express = require('express');
var socketio = require('socket.io');
var sockets = require('./sockets/events');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mean_manager');
var config = require('./config/social');

var sessionstore = require('sessionstore');
var sessionStore = sessionstore.createSessionStore();
var myCookieParser = cookieParser();

var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');

var app = express();

// bootstrap strategies
require('./config/pass')(passport, config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(myCookieParser);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ name: 'supermeancookie', secret: 'kung fu kitty', store: sessionStore, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// socket.io
var io = socketio();
app.io = io;    // bind io to app export
var io_events = './sockets/events';
require(io_events).session(io, sessionStore, cookieParser);
require(io_events).connection(io);
require(io_events).message(io);
require(io_events).joinRoom(io);

var io_export = { io: io, sessionStore: sessionStore, cookieParser: cookieParser };

app.use('/', routes);
app.use('/auth', auth);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = {app: app, io: io_export};

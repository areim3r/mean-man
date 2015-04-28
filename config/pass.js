var user_model = require('../models/users'),
    User = user_model.User;

var local = require('./strategies/local');
var facebook = require('./strategies/facebook');
var twitter = require('./strategies/twitter');
var instagram = require('./strategies/instagram');

module.exports = function (passport, config) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
      done(null, user);
  });
    passport.deserializeUser(function(user, done) {
      done(null, user);
  });

  // use these strategies
  passport.use(local);
  passport.use(facebook);
  passport.use(twitter);
  passport.use(instagram);
};
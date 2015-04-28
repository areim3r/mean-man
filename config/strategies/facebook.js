var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../social');
var hat = require('hat');
var user_model = require('../../models/users'),
    User = user_model.User;

module.exports = new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
        console.log('logging profile ', profile);
        var query = User.where({ 'facebook.id': profile.id });
    if(!req.user){
        query.findOne(function(err, user){
            if(err) return err;
            if(!user){
                var mm_username;
                if(profile.username != undefined){
                    var unformatted = profile.username;
                    mm_username = unformatted.replace(/ /g, '_');
                }else{
                    var unformatted = profile.displayName; 
                    mm_username = unformatted.replace(/ /g, '_');  
                }
                var user = new User({
                    'mm_id': hat(),
                    'mm_username': mm_username,
                    'facebook.id': profile.id,
                    'facebook.accessToken': accessToken,
                    'facebook.profile': profile
                });
                user.save(function(err, user){
                    if(err) console.log(err);
                });
                return done(null, user);
            }
            if(user){
                return done(null, user);   
            }
        });
    }else{
        var user = req.user;
            if(user.facebook != undefined){
                console.log('already authorized!');
                return done(null, user);   
            }else{
                var facebook = {
                    id: profile.id,
                    accessToken: accessToken,
                    profile: profile
                }
                User.findOne({ mm_id: req.user.mm_id}, function(err, user){
                    user.facebook = facebook;
                    user.save();
                });
                req.user.facebook = facebook;
                
                return done(null, req.user);
            }                              
    }
  }
);
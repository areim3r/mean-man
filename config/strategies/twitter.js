var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../social');
var hat = require('hat');
var user_model = require('../../models/users'),
    User = user_model.User;

module.exports = new TwitterStrategy({
    consumerKey: config.twitter.consumer_key,
    consumerSecret: config.twitter.consumer_secret,
    callbackURL: "http://localhost:3000/auth/twitter/callback",
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    var query = User.where({ 'twitter.id': profile.id });
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
                    'profile_image': profile._json.profile_image_url,
                    'twitter.id': profile.id,
                    'twitter.token': token,
                    'twitter.tokenSecret': tokenSecret,
                    'twitter.profile': profile
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
            if(user.twitter != undefined){
                console.log('already authorized!');
                return done(null, user);   
            }else{
                var twitter = {
                    id: profile.id,
                    token: token,
                    tokenSecret: tokenSecret,
                    profile: profile
                }
                User.findOne({ mm_id: req.user.mm_id}, function(err, user){
                    user.twitter = twitter;
                    user.profile_image = profile._json.profile_image_url;
                    user.save();
                });
                req.user.twitter = twitter;
                
                return done(null, req.user);
            }
        }
    }
);
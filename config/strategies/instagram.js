var InstagramStrategy = require('passport-instagram').Strategy;
var config = require('../social');
var hat = require('hat');
var user_model = require('../../models/users'),
    User = user_model.User;

module.exports = new InstagramStrategy({
    clientID: config.instagram.clientID,
    clientSecret: config.instagram.clientSecret,
    callbackURL: config.instagram.callbackURL,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    var query = User.where({ 'instagram.id': profile.id });
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
                console.log(profile);
                var user = new User({
                    'mm_id': hat(),
                    'mm_username': mm_username,
                    'profile_image': profile._json.data.profile_picture,
                    'instagram.id': profile.id,
                    'instagram.accessToken': accessToken,
                    'instagram.profile': profile
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
            if(user.instagram != undefined){
                console.log('already authorized!');
                return done(null, user);   
            }else{
                var instagram = {
                    id: profile.id,
                    accessToken: accessToken,
                    profile: profile,
                    profile_image: profile._json.data.profile_picture
                }
                User.findOne({ mm_id: req.user.mm_id}, function(err, user){
                    user.instagram = instagram;
                    user.profile_image = profile._json.data.profile_picture;
                    user.save();
                });
                req.user.instagram = instagram;
                
                return done(null, req.user);
            }
        }
  }
);
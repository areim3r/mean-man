var LocalStrategy = require('passport-local').Strategy;
var user_model = require('../../models/users'),
    User = user_model.User;

module.exports = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
      var query = { 'local.username': username};
        function findCreate(err, user){
            if(err) console.log(err);
            if(!user){
                return done(null, false, {message: 'incorrect username'});
            }else if(user){
                if(password != user.local.password){
                    return done(null, false, {message: 'incorrect password'});
                }else{
                    return done(null, user);
                }
            }else{
                    res.redirect('/');
            }
        }
      
      User
            .findOne(query)
            .exec(findCreate);
  }
)
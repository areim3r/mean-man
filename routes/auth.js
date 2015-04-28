var passport = require('passport');
var express = require('express');
var router = express.Router();

// local
router.post('/local', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send('unsuccessful'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send(user);
    });
  })(req, res, next);
});

// facebook
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));

// twitter
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));

// instagram
router.get('/instagram', passport.authenticate('instagram'));
router.get('/instagram/callback', passport.authenticate('instagram', { successRedirect: '/', failureRedirect: '/' }));

module.exports = router;
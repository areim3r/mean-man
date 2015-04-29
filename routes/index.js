var express = require('express');
var app = require('../app');
var router = express.Router();
var user_ctrl = require('../controllers/users');
var Twit = require('twit');
var tweets = require('../controllers/twitter');

var social = require('../controllers/social');
var grams = require('../controllers/instagram');
var users = require('../controllers/users');

/* GET home page. */
router.get('/', users.getUser);

router.get('/settings', users.getSettings);

// signup routes
router.get('/login', function(req,res,next){
    res.render('login', {title: 'Log In'}); 
});

// signup routes
router.get('/signup', function(req,res,next){
    res.render('signup', {title: 'Sign Up'}); 
});
router.post('/signup', user_ctrl.create);

// logout
router.get('/logout', function(req,res,next){
    req.logout();
    console.log('logged out');
    //res.send('logged out');
    res.redirect('/');
});

router.use('/social', social.get);

//router.get('/tweets', tweets.get);    deprecated into social route
//router.get('/grams', grams.get);      deprecated into social route

router.get('/update/tweets', tweets.update);
router.get('/update/grams', grams.update);

module.exports = router;

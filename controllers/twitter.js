var Twit = require('twit');
var config = require('../config/social');

module.exports = {


    get: function(req, res, next) {
        
        var T = new Twit({
            consumer_key: config.twitter.consumer_key,
            consumer_secret: config.twitter.consumer_secret,
            access_token: config.twitter.access_token,
            access_token_secret: config.twitter.access_token_secret
        });
        
        T.get('search/tweets', { q: 'web development since:2011-11-11', count: 10 }, function(err, tweets, response) {
            if(err){console.log(err)}

            if (tweets) {
                var tweetsToClient = [],
                    totalTweets = tweets.statuses;
                    
                for(var i = 0; i < totalTweets.length; i++){
                    var current_tweet = {}
                    current_tweet.status = totalTweets[i].text;
                    current_tweet.user = totalTweets[i].user.screen_name;
                    tweetsToClient.push(current_tweet);
                }
                sendTweets(tweetsToClient);
            } else {
                sendTweets(false);
            }

        });

       

        function sendTweets(tweets){

            console.log('\nSending tweets..\n');
            console.log(tweets);
            if(req.user){
                res.render('social', {title: 'Social Feed', user: req.user, tweets: tweets});
            } else {
                res.render('social', {title: 'Social Feed', tweets: tweets});
            }
        }

      
    },
    
    update: function(req, res, next){
        var tweetsToClient = [];

        var T = new Twit({
            consumer_key: config.twitter.consumer_key,
            consumer_secret: config.twitter.consumer_secret,
            access_token: config.twitter.access_token,
            access_token_secret: config.twitter.access_token_secret
        });

        T.get('search/tweets', { q: 'technology since:2011-11-11', count: 10 }, function(err, tweets, response) {
            if(err){console.log(err)}

            if (tweets) {
                var tweetsToClient = [],
                    totalTweets = tweets.statuses;
                    
                for(var i = 0; i < totalTweets.length; i++){
                    var current_tweet = {}
                    current_tweet.status = totalTweets[i].text;
                    current_tweet.user = totalTweets[i].user.screen_name;
                    tweetsToClient.push(current_tweet);
                }
                sendTweets(tweetsToClient);
            } else {
                sendTweets(false);
            }

        });

        function sendTweets(tweets){
            res.send(tweets);
        }
    }
    
}
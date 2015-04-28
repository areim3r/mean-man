var Twit = require('twit');
var ig = require('instagram-node').instagram();
var endpoint = require('./endpoints/filter');
var InstaEnd = require('./endpoints/filter').InstaEnd;
var config = require('../config/social');
var async = require('async');
var request = require('request');
ig.use({ client_id: config.instagram.clientID,
         client_secret: config.instagram.clientSecret });

module.exports = {

    get: function(req, res, next) {

        if(false != req.user.mm_username){
            console.log('\n\n');
            console.log(req.user.mm_username);
            console.log('\n\n');
        }else {
            console.log('\n\n');
            console.log('No User Found');
            console.log('\n\n');
        }
        
        var social_media = {};
        var img_res = 'standard'; // or 'low' or 'thumb'
        
        async.parallel([
            function(callback) {
                
                var grams_array = [];
                if(req.user != undefined && req.user.instagram != undefined){
                    var feed_url = InstaEnd('user_feed', req.user.instagram.accessToken);
                    request(feed_url, function(err, response, body) {
                        if(err) { console.log(err); callback(true); return; }
                        obj = JSON.parse(body);
                        for(x in obj.data){
                            var images = obj.data[x].images;
                            switch(img_res){
                                case 'standard':
                                    grams_array.push(images.standard_resolution);
                                    break;
                                case 'low':
                                    grams_array.push(images.low_resolution);
                                    break;
                                case 'thumb':
                                    grams_array.push(images.thumbnail);
                                    break;
                                default:
                                    return;
                            }
                        }
                        social_media.grams = grams_array;
                        callback(false, social_media.grams);
                    });
                }else{
            ig.tag_media_recent('uwotm8', function(err, images, pagination, remaining, limit) {

                if(err){
                    console.log(err); callback(true); return;
                }else {

                    for(i in images){ 
                        grams_array.push(images[i].images.standard_resolution);
                    }
                    social_media.grams = grams_array;
                    callback(false, social_media.grams);
                }

            });
                
                
                }
            },
            function(callback){
                var T = new Twit({
                    consumer_key: config.twitter.consumer_key,
                    consumer_secret: config.twitter.consumer_secret,
                    access_token: config.twitter.access_token,
                    access_token_secret: config.twitter.access_token_secret
                });
                
                if(req.user != undefined && req.user.twitter != undefined){
                    T.get('statuses/home_timeline', { count: 10 }, function(err, tweets, response) {
                        if(err){console.log(err); callback(true); return; }

                        if (tweets) {
                            var tweetsToClient = [];
                            for(var i = 0; i < tweets.length; i++){
                                var current_tweet = {}
                                current_tweet.status = tweets[i].text;
                                current_tweet.user = tweets[i].user.screen_name;
                                tweetsToClient.push(current_tweet);
                            }
                            social_media.tweets = tweetsToClient;
                            callback(false, social_media.tweets);
                        }

                    });
                    
                }else{
                
                T.get('search/tweets', { q: 'web development since:2011-11-11', count: 10 }, function(err, tweets, response) {
                    if(err){console.log(err); callback(true); return; }

                    if (tweets) {
                        var tweetsToClient = [],
                            totalTweets = tweets.statuses;

                        for(var i = 0; i < totalTweets.length; i++){
                            var current_tweet = {}
                            current_tweet.status = totalTweets[i].text;
                            current_tweet.user = totalTweets[i].user.screen_name;
                            tweetsToClient.push(current_tweet);
                        }
                        social_media.tweets = tweetsToClient;
                        callback(false, social_media.tweets);
                    }

                });
                
                }
                
            }
        ],
        function(err, results) {
            if(err) { console.log(err); res.send(500,"Server Error"); return; }
            res.send({tweets: social_media.tweets, grams: social_media.grams}); 
        });
         
    }
    
}
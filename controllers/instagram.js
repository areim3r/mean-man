var ig = require('instagram-node').instagram();
var config = require('../config/social');

ig.use({ client_id: config.instagram.clientID,
         client_secret: config.instagram.clientSecret });

module.exports = {

    get: function(req, res, next) {
    
        var grams_array = [];
        
        ig.tag_media_recent('uwotm8', function(err, images, pagination, remaining, limit) {

            if(err){
                console.log(err);
            }else {

                for(i in images){ 
                    grams_array.push(images[i].images.standard_resolution);
                }
                sendGrams(grams_array);

            }

        });

        function sendGrams(the_grams){
            console.log(the_grams);
            res.render('social', {title: 'Social Feed', grams: the_grams});
        }
          
    },
        
    update: function(req, res, next){
        var grams_array = [];
        
        ig.tag_media_recent('doge', function(err, images, pagination, remaining, limit) {

            if(err){
                console.log(err);
            }else {

                for(i in images){ 
                    grams_array.push(images[i].images.standard_resolution);
                }
                sendGrams(grams_array);

            }

        });

        function sendGrams(grams){
            res.send(grams);
        }
    }
    
}
var instagram = require('./endpoints').instagram,
    twitter = require('./endpoints').twitter;

function returnEnd(endpoint, token){
        return endpoint+token;
    }

/*
module.exports = function(provider, endpoint, token, userID){
    
    function returnEnd(provider, url, token){
        for(endpoint in provider){
            if(endpoint == url){
                return provider[endpoint]+token;   
            }
        }
    }
    
    switch(provider){
        case 'instagram':
            var provider = instagram;
            return returnEnd(provider, endpoint, token);
            break;
        case 'twitter':
            var provider = twitter;
            return returnEnd(provider, endpoint, token);
            break;
        default:
            break;
    }
    
}
*/
module.exports = {
    InstaEnd: function(endpoint, token, userID, mediaID, shortcode, commentID, tagName, locationID, geoID){
        
        switch(endpoint){
            case 'user':
                return instagram.users.user(userID, token);
                break;
            case 'user_feed':
                return instagram.users.user_feed(token);
                break;
            case '':
                break;
            case '':
                break;
            case '':
                break;
            case '':
                break;
            case '':
                break;
            case '':
                break;
            default:
                break;
        }
       
    }
}
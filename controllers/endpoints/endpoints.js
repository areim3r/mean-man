module.exports = {
    instagram: {
        users: {
            user: function(userID, token){return 'https://api.instagram.com/v1/users/'+userID+'/?access_token='+token},
            user_feed: function(token){return 'https://api.instagram.com/v1/users/self/feed?access_token='+token},
            user_recent_media: function(userID){'https://api.instagram.com/v1/users/'+userID+'/media/recent/?access_token='},
            user_recent_media_client: function(userID){'https://api.instagram.com/v1/users/'+userID+'/media/recent/?client_id='},
            user_liked: 'https://api.instagram.com/v1/users/self/media/liked?access_token=',
            user_search: 'https://api.instagram.com/v1/users/search?q=jack&access_token='
        },
        relationships: {
            users_follows: function(userID){return 'https://api.instagram.com/v1/users/'+userID+'/follows?access_token='},
            users_followed_by: function(userID){return 'https://api.instagram.com/v1/users/'+userID+'/followed-by?access_token='},
            users_requested_by: 'https://api.instagram.com/v1/users/self/requested-by?access_token=',
            users_relationship: function(userID){return 'https://api.instagram.com/v1/users/'+userID+'/relationship?access_token='}
        },
        media: {
            media: function(mediaID){return 'https://api.instagram.com/v1/media/'+mediaID+'?access_token='}
        },
        comments: {
            
        },
        likes: {
            
        },
        tags: {
            
        },
        locations: {
            
        },
        geographies: {
        
        }
    },
    twitter: {
        user_timeline: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2'
    }
}
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    mm_id: String,
    mm_username: String,
    profile_image: String,
    friends: Array,
    friendRequests: Array,
    local: {
        id: String,
        username: String,
        password: String,
        email: String
    },
    facebook: {
        id: String,
        accessToken: String,
        profile: Object
    },
    twitter: {
        id: String,
        token: String,
        tokenSecret: String,
        profile: Object
    },
    instagram: {
        id: String,
        accessToken: String,
        profile: Object
    }
});

var User = mongoose.model('User', userSchema);

module.exports = { User: User }
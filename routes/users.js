var express = require('express');
var router = express.Router();
var users = require('../controllers/users');

/* search for friend */
router.post('/', users.search);

/* send friend request */
router.get('/add-friend/:username', users.addFriend);

/* get friends related info, ie username, new requests, etc */
router.get('/:username/friends', users.friends);

/* accept or ignore friend requests */
router.post('/:username/resolve-friends', users.resolveFriends);

module.exports = router;

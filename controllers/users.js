var user_model = require('../models/users.js'),
    User = user_model.User;
var hat = require('hat');

module.exports = {
    create: function(req, res, next){
        var query = { username: req.body.username};
        
        function createUser(err, user){
            if(err) console.log(err);
            if(!user){
                var user = new User({
                    'mm_id': hat(),
                    'mm_username': req.body.username,
                    'local.id': hat(),
                    'local.username': req.body.username,
                    'local.password': req.body.password,
                    'local.email': req.body.email
                });
                user.save(function(err){
                    if(err) console.log(err);
                    console.log('saved! '+ user);
                    req.login(user, function(err){
                        if(err) { console.log(err); }
                        // console.log(user);
                        return res.redirect('/');
                    });
                });   
            }else if(user){
                    // console.log(user);
                    res.redirect('/');
                
            }else{
                    res.redirect('/');
            }
        }
        
        User
            .findOne(query)
            .exec(createUser);
        console.log('request body '+req.body);
        
    },
    getUser: function(req,res,next){
        
        if(req.user != undefined){
    		var displayName = req.user.mm_username;
            var user = { mm_username: req.user.mm_username, profile_img: req.user.profile_image, friendRequests: req.user.friendRequests, friends: req.user.friends };
        	res.render('dashboard', {title: 'Dashboard', user_display_name: displayName, user: user});

            }else{
                res.render('login', {title: 'Log In', user: false}); 
            }
    },
    getSettings: function(req,res,next){
        if(req.user != undefined){

            var displayName = req.user.mm_username;
            
            res.render('settings', {title: 'Settings', user_display_name: displayName, user: req.user});

            }else{
                res.render('login', {title: 'Log In', user: false}); 
            }
    },
    friends: function(req,res,next){
        User.findOne({mm_username: req.params.username}, function(err, user){
            if(err) return console.error(err);
            if(!user){
                return res.send(null);   
            }else{
            var data = { pending: user.friendRequests, friends: user.friends };
            return res.send(data);
            }
        });
    },
    search: function(req,res,next){
        User.findOne({ mm_username: req.body.username }, function(err, users){
            if(err){ console.error('error searching username'); }
            if(users != null && users != undefined){
                if(req.user){
                    if(users.mm_username != req.user.mm_username){
                        var user = [{username: users.mm_username}];
                        return res.send(user);
                    }else{
                        var message = [{message: 'you want to friend yourself?!'}];
                        return res.send(message);   
                    }
                }else{
                    return res.send('blah');   
                }
            }else{
                var message = [{message: req.body.username + ' not found'}];
                return res.send(message);   
            }
        });
    },
    addFriend: function(req,res,next){
        User.findOne({mm_username: req.params.username}, function(err, user){
            if(req.user != undefined){
                var req_message = [{message: 'friend request sent!'}];  // successful request message
                if(!user.friendRequests){   // if no friend requests yet
                    user.friendRequests = [];
                    user.friendRequests.push({username: req.user.mm_username, status: null});
                    user.save(function(err, friend){
                            if(err) return console.error(err);
                        });
                    return res.send(req_message);
                }else{
                    for(x in user.friendRequests){  // check if already sent friend request
                        if(user.friendRequests[x].username == req.user.mm_username){
                            var message = [{message: 'friend request pending'}];
                            return res.send(message);   
                        }
                    }   
                    user.friendRequests.push({username: req.user.mm_username, status: null});
                    user.save(function(err){
                            if(err) return console.error(err);
                        });
                    console.log('sending success message ', req_message);
                    return res.send(req_message);
                }
            }
        });
    },
    resolveFriends: function(req,res,next){
        
        function friendMe(user){
            User.findOne({mm_username: user}, function(err, user){
                if(err) return console.error(err);
                user.friends.push(req.user.mm_username);    // add requesting user to target users friends
                user.save(function(err){
                    if(err) return console.error(err); 
                });
                var message = [{message: 'now friends with '+user.mm_username+'!'}];
                return res.send(message);
            });
        }
        
        function removeRequest(user, addingFriend){
            for(x in user.friendRequests){
                    if(user.friendRequests[x].username != undefined){
                        if(user.friendRequests[x].username == req.params.username){ // on match remove from request array
                            if(addingFriend){
                                user.friends.push(req.params.username);     // add target user to logged in users friends
                            }
                            user.friendRequests.splice(x, 1);       // remove user from friendRequests
                            user.save(function(err){
                                if(err) return console.error(err); 
                            });   
                            if(addingFriend){
                                friendMe(req.params.username);
                            }else{
                                var message = [{message: 'Ignored '+req.params.username+'\'s request!'}];
                                return res.send(message);
                            }
                        } 
                    }
                }
        }
        
        User.findOne({mm_username: req.user.mm_username}, function(err, user){  // logged in user
            if(err) return console.error(err);
            if(!req.body.accepted){
                removeRequest(user);
            }else{
                removeRequest(user, true);
            }
        });
    }
}
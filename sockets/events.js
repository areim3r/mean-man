var passportSocketIo = require('passport.socketio');
var emoji = require('node-emoji');

var users = {};

module.exports = {
    session: function(io, sessionStore, cookieParser){
        
    io.use(passportSocketIo.authorize({
      cookieParser: cookieParser, 
      key:          'supermeancookie',       
      secret:       'kung fu kitty',   
      store:        sessionStore,        
      success:      onAuthorizeSuccess,  
      fail:         onAuthorizeFail,     
    }));
    function onAuthorizeSuccess(data, accept){
      console.log('successful connection to socket.io');
      // The accept-callback still allows us to decide whether to
      // accept the connection or not.
      accept(null, true);
    }
    function onAuthorizeFail(data, message, error, accept){
      if(error)
        throw new Error(message);
      console.log('failed connection to socket.io:', message);

      // We use this callback to log all of our failed connections.
      accept(null, false);
    }
        
    },
    connection: function (io) {
        io.on('connection', function(socket){
            
            if(socket.request.user.mm_username != undefined){
                username = socket.request.user.mm_username;
                users[username] = socket;
                io.emit('chat message', username+' joined the chat');
            }
            socket.on('new buddy', function(data){
                console.log(username);
            });
            
            console.log('a user  connected');
            io.on('disconnect', function(){
                console.log('user disconnected'); 
            });  
        });
        
    },
    message: function (io) {
        io.on('connection', function(socket){
            socket.on('chat message', function (msg, username) {
                var filtered_msg = [];
                var words = msg.split(' ');
                for(x in words){
                    var emo_check = /^_{2}/gm,
                        curr_word = words[x],
                        wantsEmoji = emo_check.test(curr_word);
                    if(!wantsEmoji){
                        filtered_msg.push(curr_word); 
                    }else{
                        /////
                        //-- to use emojis
                        //-- simply prepend __ to the name, ie wink emoji is: __wink
                        //-- list of available emojis here: http://www.emoji-cheat-sheet.com/
                        /////
                        // remove the underscores
                        var rmv_underscore = /_{2}/,
                            txt_to_emoji = curr_word.replace(rmv_underscore, ''),
                            emojis = emoji.emoji,
                            isEmoji;
                        // get key_names to compare
                        var emos = Object.keys(emojis);
                        for(x=0;x<emos.length;x++){
                            if(emos[x] == txt_to_emoji){ 
                                var emoticon = emoji.get(txt_to_emoji)+',';
                                filtered_msg.push(emoticon);
                                isEmoji = true;
                                break;
                            }  
                        }
                        if(!isEmoji){ // if starts w/ __ but no emoji match, send word back
                            filtered_msg.push(txt_to_emoji);    
                        }
                    }
                    
                }
                var join_words = filtered_msg.join(),
                    rmv_comma = /,/gm,
                    new_msg = join_words.replace(rmv_comma, ' '),
                    username = socket.request.user.mm_username;
                io.emit('chat message', new_msg, username);
            });   
        });
    },
    store_user: function(io){
        var chat_rooms = [];
        io.on('connection', function(socket){
            socket.on('store user', function(user) { 
                console.log('storing user', user);
                users[user] = socket.id;
                
                console.log(users);
            });   
            
            socket.on('private message', function(data) {
                var user = users[data.to];
                io.to(user).emit('p-message', data);    // send message to specific user
            });
            
        });
    }
}
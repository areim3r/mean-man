var socket = io();

$(function(){
    if(user != undefined){
    changeRoom(user.mm_username);
    }
});

$('#socketsForm').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg, username){
    if(username != undefined){

        var _li = $('<li>').attr('class', 'chat-msg has-user').html('<span class="username">'+username+': </span>'+'<span class="message">'+msg+'</span>');

        $('#messages.global').append(_li); 
    }else{   

        var _li = $('<li>').attr('class', 'chat-msg has-user').html('<span class="username">Anonymous: </span>'+'<span class="message">'+msg+'</span>');

        $('#messages.global').append(_li); 
    }
});

socket.on('message', function (data) {
    if($('#chatDisplay-'+data.from).attr('id') != undefined){   // if the chat box has been opened
        var _li = $('<li>').html('<span class="message">'+data.message+'</span>');
        $('#chatDisplay-'+data.from).append(_li);
    }else{
        var toUser = data.room,
            fromUser = data.from,
            message = data.message;
        privateDialogue(toUser, fromUser, message);
    }
});

function changeRoom(room){
    if(room != undefined){
        console.log('joining ', room);
        var homeRoom = user.mm_username;
        var data = { room: room, homeRoom: homeRoom };
        socket.emit('subscribe', data);
    }
}

function privateChat(chatname, message, self){
    var chatName = chatname.replace('chat-', '');
    var chatIn = $('#chatIn-'+chatName);
    var message = chatIn.val();
    console.log('message is: ', message);
    socket.emit('send', { room: chatName, message: message, from: user.mm_username });
    
    var _li = $('<li>').html('<span class="message">'+message+'</span>');
    $('#chatDisplay-'+chatName).append(_li);
    if(self){
        $('#chatDisplay-'+self).append(_li);
    }
    chatIn.val('');
}

function privateDialogue(toUser, fromUser, message){
    if(fromUser != user.mm_username){
            var el = $('#header .module');
            console.log('loggin user ',toUser);
            var chatDisplay = "<ul id='chatDisplay-"+fromUser+"' class='chatDisplay'></ul>";
            var chatIn = "<form onsubmit='event.preventDefault();  privateChat(this.id, this.value, "+'"'+fromUser+'"'+")' id='chat-"+toUser+"' action=' '><input id='chatIn-"+toUser+"' class='chatIn' type='text' placeholder='message...'/></form>";
            var chatbox = "<div ng-controller='friends' class='privateChat chat' id='messages'>"+chatDisplay+chatIn+"<div class='close-chat' onclick='closeChat("+"'chatDisplay-"+fromUser+"'"+")'></div><h6 class='pchat-heading username'>"+fromUser+"</h6></div>";
            el.append(chatbox);
            var _li = $('<li>').html('<span class="message">'+message+'</span>');
            $('#chatDisplay-'+fromUser).append(_li);
    }
}

function closeChat(chat){
    $('#'+chat).remove();   
}
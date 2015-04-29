var socket = io();

$(function(){
    if(user != undefined){
    storeUser(user.mm_username);
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

socket.on('p-message', function (data) {
    if($('#chatDisplay-'+data.from).attr('id') != undefined){   // if the chat box has been opened
        var _li = $('<li>').html('<span class="userSymbol">'+data.from+'</span><span class="message">'+data.message+'</span>');
        $('#chatDisplay-'+data.from).append(_li);
        var msgContainer = '#p-msg-'+data.from;
        $(msgContainer).scrollTop($(msgContainer)[0].scrollHeight);
    }else{      // create a chat box between target user and current user
        var toUser = data.to,
            fromUser = data.from,
            message = data.message;
        privateDialogue(toUser, fromUser, message);
    }
});

function storeUser(user){
    if(user != undefined){
        socket.emit('store user', user);
    }
}

function privateChat(username, message, self){
    var un = username.replace('chat-', '');
    var chatIn = $('#chatIn-'+un);
    var message = chatIn.val();
    socket.emit('private message', { message: message, from: user.mm_username, to: un });
    
    chatIn.val('');
}

function privateDialogue(toUser, fromUser, message){
    if(fromUser != user.mm_username){
            var el = $('#header');
            var chatDisplay = "<ul id='chatDisplay-"+fromUser+"' class='chatDisplay'></ul>";
            var chatIn = "<form onsubmit='event.preventDefault();  privateChat(this.id, this.value, "+'"'+fromUser+'"'+")' id='chat-"+fromUser+"' action=' '><input id='chatIn-"+fromUser+"' class='chatIn' type='text' placeholder='message...'/></form>";
            var chatbox = "<div ng-controller='friends' class='privateChat chat privateChatBox' id='chatbox-"+fromUser+"'>"+"<div id='p-msg-"+fromUser+"' class='msgsContainer'>"+chatDisplay+"</div>"+chatIn+"<i id='close-"+fromUser+"' class='close-chat fa fa-times fa-lg' onclick='closeChat(this.id)'></i><h6 class='pchat-heading username'>"+fromUser+"</h6></div>";
            el.append(chatbox);
            var _li = $('<li>').html('<span class="userSymbol">'+fromUser+'</span><span class="message">'+message+'</span>');
            $('#chatDisplay-'+fromUser).append(_li);
            var msgContainer = '#p-msg-'+fromUser;
            $(msgContainer).scrollTop($(msgContainer)[0].scrollHeight);
    }else{
        var _li = $('<li>').html('<span class="userSymbol">'+fromUser+'</span><span class="message">'+message+'</span>');
        $('#chatDisplay-'+toUser).append(_li);   
        var msgContainer = '#p-msg-'+toUser;
        $(msgContainer).scrollTop($(msgContainer)[0].scrollHeight);
    }
}

function closeChat(chat_name){
    var username = chat_name.replace('close-', '');
    $('#chatbox-'+username).remove();
}
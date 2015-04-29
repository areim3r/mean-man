angular.module('mean-manager')
    .controller('friends', ['$scope', '$http', '$cookieStore', 'flash', 'getFriends', 'refreshFriends', 'addFriends', 'findFriends', 'resolveFriends', function($scope, $http, $cookieStore, flash, getFriends, refreshFriends, addFriends, findFriends, resolveFriends){
        var session_user = $cookieStore.get('user');
        if(session_user != undefined){
        
        getFriends.get(function(data){
            $scope.pendingFriends = data.pendingFriends;
            $scope.friends = data.friends;
        });
            
        $scope.refreshFriends = function(){
            refreshFriends.get(function(data){
                $scope.pendingFriends = data.pendingFriends;
                $scope.friends = data.friends;
            });
        }
        
        $scope.searchFriends = function(){
            findFriends.find(function(data){
                $scope.addFriends = data.addFriends;
                $scope.messages = data.messages;
            }, $scope.searchFriend);
        }
        
        $scope.addFriend = function(user){
            addFriends.add(function(data){
                $scope.messages = data.messages;
                $scope.addFriends = data.addFriends; 
            }, user);
        }
        
        $scope.resolveFriend = function(user, decision, rmvEl){
            $scope.messages = null;
            var clearEl = angular.element(document.querySelector('#'+rmvEl));
            clearEl.remove();
            
            resolveFriends.resolve(function(data){
                $scope.messages = data.messages;
            }, user, decision);
        }
        
        $scope.private = function(user){
            var el = angular.element('#header');
            var chatDisplay = "<ul id='chatDisplay-"+user+"' class='chatDisplay'></ul>";
            var chatIn = "<form onsubmit='event.preventDefault(); privateChat(this.id, this.value)' id='chat-"+user+"' action=' '><input id='chatIn-"+user+"' class='chatIn' type='text' placeholder='message...'/></form>";
            var chatbox = "<div ng-controller='friends' class='privateChat chat privateChatBox' id='chatbox-"+user+"'>"+"<div id='p-msg-"+user+"' class='msgsContainer'>"+chatDisplay+"</div>"+chatIn+"<i id='close-"+user+"' class='close-chat fa fa-times fa-lg' onclick='closeChat(this.id)'></i><h6 class='pchat-heading'>"+user+"</h6></div>";
            
            el.append(chatbox);
        }
    }
}]);
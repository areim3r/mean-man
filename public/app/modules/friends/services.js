angular.module('mean-manager')
    .factory('getFriends', function($http){
        var getFriends = {};
        getFriends.get = function(callback){
            $http.get('/users/'+user.mm_username+'/friends')
            .success(function(data, status, headers, config){
                var userFriends = {};
                if(data.pending != undefined){
                    var pendingList = data.pending.length;
                    if(!(pendingList > 0)){
                        userFriends.pendingFriends = null;
                    }else{
                        userFriends.pendingFriends = data.pending;
                    }
                }
                if(data.friends != undefined){
                    var friendsList = data.friends.length;
                    if(!(friendsList > 0)){
                        userFriends.friends = null;
                    }else{
                        userFriends.friends = data.friends;
                    }
                }
                callback(userFriends);
            })
            .error(function(data, status, headers, config){
                console.log(status);
            });
        };
        return getFriends;
    })
    .factory('refreshFriends', function($http){
        var refreshFriends = {};
        refreshFriends.get = function(callback){
            $http.get('/users/'+user.mm_username+'/friends')
            .success(function(data, status, headers, config){
                var userFriends = {};
                var pendingList = data.pending.length;
                if(!(pendingList > 0)){
                    userFriends.pendingFriends = null;
                }else{
                    userFriends.pendingFriends = data.pending;
                }
                var friendsList = data.friends.length;
                if(!(friendsList > 0)){
                    userFriends.friends = null;
                }else{
                    userFriends.friends = data.friends;
                }
                callback(userFriends);
            })
            .error(function(data, status, headers, config){
                console.log(status);
            });
        };
        return refreshFriends;
    })
    .factory('findFriends', function($http){
        var findFriends = {};
    
        findFriends.find = function(callback, friendToSearch){
            $http.post('/users', friendToSearch)
                .success(function(data, status, headers, config){
                    var searched = {};;
                    searched.addFriends = data;
                    searched.messages = data;
                    callback(searched);
                })
                .error(function(data, status, headers, config){
                    console.log(status);
                });   
        };
        return findFriends;
    })
    .factory('addFriends', function($http, flash){
        var addFriends = {};

        addFriends.add = function(callback, newUser){
            $http.get('/users/add-friend/'+newUser)
                    .success(function(data, status, headers, config){
                        var message = {};
                        message.messages = data;
                        message.addFriends = null;
                
                        flash.success = 'friend request to '+newUser+' sent!';
                        callback(message);
                    })
                    .error(function(data, status, headers, config){
                        console.log(data, status);
                    });
        };
        return addFriends;
    })
    .factory('resolveFriends', function($http, flash){
        var resolveFriends = {};
    
        resolveFriends.resolve = function(callback, user, decision){
            $http.post('/users/'+user+'/resolve-friends', {accepted: decision})
                .success(function(data, status, headers, config){
                    var message = {};
                    message.messages = data;
                
                    flash.success = data[0].message;
                    callback(message);
                })
                .error(function(data, status, headers, config){
                    console.log(data, status);
                }); 
        };
        return resolveFriends;
    });
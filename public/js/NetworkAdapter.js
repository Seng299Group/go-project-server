class NetworkAdapter {
	
	/* List of variables
	* 
	* __socket		- established socket with the server.
	*					A Socket.io object. Use setSocket()
	* 
	*/
	
	constructor(){
		this.__socket = io();
                
                // Event: When client receives online players' list
                this.__socket.on('playerList', function (data) {

                        // String to object
                        var playerList = JSON.parse(data);

                        onReceivedPlayerList(playerList);
                });


                // The client received a game request
                this.__socket.on('gameRequest', function (fromUser) {
                        onReceivedGameRequest(fromUser);
                });


                // Log Error if server sends an error message
                this.__socket.on('_error', function (data) {
                        if (data === "duplicate player"){
                                $("body").html("this account is already logged in");
                        } else if (data === "player is not online") {
                                log("player is not online. unimplemented"); // todo
                        } else {
                                console.log(data);
                        }
                });
	}
	
	
	
	
	
	sendMove(){
		console.log("unimplemented method call");
	}
	
	getAIMove(size, board, lastMove, callback){
		var data = {
			"size": size,
			"board": board,
			"last": lastMove
		};
		
		$.ajax({
			type: 'POST',
			url : '/ai',
			dataType: "json",
			data : JSON.stringify(data),
			contentType : "application/json",
			success : function(res){
				callback(res);
			},
			error : function(res){
				log(res.responseText);
			}
		});
	}

	
	createAccount(){
		console.log("unimplemented method call");
	}
	
	updateAccount(){
		console.log("unimplemented method call");
	}
	
	login(){
		console.log("unimplemented method call");
	}
	
	lookForGame(){
		console.log("unimplemented method call");
	}
	
	/**
	* @param {object} data - { toUser: username, fromUser: username}
	*/
	inviteToGame(data){
		this.__socket.emit("gameRequest", data);
	}
	
	/**
	* @param {string} username - client user's username
	*/
	sendUsername(username){
		this.__socket.emit("newPlayer", username);
	}
        
        /**
         * 
         */
        getUserdataForThisSession(){
            //console.log(sessionStorage.sessionID);
            
            // new session
            if(sessionStorage.sessionID === undefined){
                console.log("new session");
                sessionStorage.sessionID = "test";
            } else {
                console.log("old session");
            }
            
            //this.__socket.emit("userdata", "all");
        }
        
        
        
        
	
}

class NetworkAdapter {
	
	/* List of variables
	* 
	* __socket		- established socket with the server.
	*					A Socket.io object. Use setSocket()
	* 
	*/
	
	constructor(){
		
	}
	
	setSocket(socket){
		this.__socket = socket;
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
		socket.emit("gameRequest", data);
	}
	
	/**
	* @param {string} username - client user's username
	*/
	sendUsername(username){
		socket.emit("newPlayer", username);
	}
	
}

class NetworkAdapter {

	constructor(){

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

	createAccount(username, password, security){
		var socket = io();

		// sending data to server to authenticate
		socket.emit("newAccount", {username: username, password: password, security: security});
	}

	updateAccount(){
		console.log("unimplemented method call");
	}

        /**
         * @param {string} username
         * @param {string} password
         * @param {function} callback - function that is called when server responds with authentication results
         */
	login(username, password, callback){
            var socket = io();

            // sending data to server to authenticate
            socket.emit("accountLogin", {username: username, password: password});

            // Login succeeded
            socket.on("loginSucceeded", function(){
                callback(true, socket.id);
            });

            // Login failed
            socket.on("loginFailed", function(){
                callback(false, null);
            });
	}

}

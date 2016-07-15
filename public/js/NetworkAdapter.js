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
	
}

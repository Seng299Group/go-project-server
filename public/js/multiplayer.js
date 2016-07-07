
// User data of the client
// Set to default data (Guest user data)
var user = {
	username: "user" + (new Date()).getTime(), // send username form here
	opponent: "null",
	lastMove: "null"
}

// todo: If the client is logged in
// get user's data from the database
// and update the "user" variable above





// Once user data is available, update the profile section.
decorateProfile();

// and send username to the server
networkAdapter.sendUsername(user.username);




/********************************* Socket IO **********************************/

/* List of Socket IO triggered events.
* 
* playerList 		- when the server sends a list of all online players
* gameRequest		- when the server sends a game request
* _error			- when the server sends an error signal that require
*						client-side attention (e.g. user account is
*						already logged in, target user is offline etc.)
*
*/



// Event: When client receives online players' list
socket.on('playerList', function (data) {
	
	// String to object
	var playerList = JSON.parse(data);
	
	onReceivedPlayerList(playerList);
});


// The client received a game request
socket.on('gameRequest', function (fromUser) {
	onReceivedGameRequest(fromUser);
});


// Log Error if server sends an error message
socket.on('_error', function (data) {
	if (data === "duplicate player"){
		$("body").html("this account is already logged in");
	} else if (data === "player is not online") {
		log("player is not online. unimplemented"); // todo
	} else {
		console.log(data);
	}
});





/********************** JavaScript and DOM manipulation ***********************/

/* List of functions for DOM manipulation
*
* decorateProfile			- updates the profile section
* onReceivedPlayerList		- inflates the online players' section
* sendRequest				- sends a game request to an user
* onReceivedGameRequest		- when the client receives a game request
* onLogoutButtonPress		- when the user presses the logout button
* 
*/



/**
* This function updates the profile section of the page.
*/
function decorateProfile(){
	$('#profile-username').html(user.username);
	// other profile related stuff
}

/**
* This function is called when the 
*/
function onReceivedPlayerList(playerList){

	// Clear the UI
	$('#onlinePlayers-list').empty();
	
	// generate new list on the UI
	for (p in playerList) {
		if(p != user.username){ // != instead of !== for type conversion
			$('#onlinePlayers-list').append(makeRequestElement(playerList[p]));
		}
	}

	
	
	/**
	* Creates a row for the online users' section
	*
	* @param {object} forUser - User object (follows server-side
	*											User object standards)
	*/
	function makeRequestElement(forUser){
		
		// A row for the player
		var div = $(document.createElement('div'));
		div.attr("class","onlinePlayers-row");
		
		var reqButton = makeRequestButton(forUser);
		
		// Nesting DOM elements
		div.append(forUser.__username);
		div.append(reqButton);
		
		return div;
	}

	/**
	* Creates a button to challenge a user
	*
	* @param {object} forUser - User object (follows server-side
	*											User object standards)
	*/
	function makeRequestButton(forUser){
		// A button to send game request
		var reqButton = $(document.createElement('div'));
		reqButton.attr("class","button_sendRequest");
		reqButton.html("Send Invitation");
		
		reqButton.click(function(){
			
			// Checking if game invitation is not sent
			if ( $(this).attr("class") ===  "button_sendRequest" ){
				
				// Send request
				sendRequest(forUser.__username);
				
				// Update UI
				$(this).html("Invitation Sent");
				$(this).attr("class","button_requestSent");
				$(this).removeAttr("onclick");
				
			} else if ( $(this).attr("class") ===  "button_requestSent" ) {
				// todo notify user to wait for opponent to accept request
				console.log("request has been sent. please wait. unimplemented");
			}
			
		});
		
		return reqButton;
	}
	
}

/**
* This function sends a game request to the target user
*
* @param {string} toUser - The target user
*/
function sendRequest(toUser){
	var data = {
		toUser: toUser,
		fromUser: user.username
	}
	networkAdapter.inviteToGame(data);
}

/**
* This function is called when the user receives a game request
*/
function onReceivedGameRequest(fromUser){
	var div = $(document.createElement('div'));
	div.attr("class","gameRequest-row");
	div.html(fromUser + " challenged you.");
	
	var button_accept = $(document.createElement('button'));
	button_accept.html("accept");
	button_accept.click(function(){
		log("accepted request. unimplemented method call");
	});
	
	var button_decline = $(document.createElement('button'));
	button_decline.html("decline");
	button_decline.click(function(){
		log("declined request. unimplemented method call");
	});
	
	div.append(button_accept);
	div.append(button_decline);
	$("#gameRequests-list").append(div);
}

/**
* This function is called when the user clicks the logout button
*/
function onLogoutButtonPress(){
	log("logout button pressed. unimplemented method call.");
}
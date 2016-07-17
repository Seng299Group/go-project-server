
sessionStorage.gameMode = "network";

var socket = io();

var nfBuilder = new NotificationBuilder();

/**
 * This object must be retrieved from the server using getUserData.
 * And since this will be recieved from sever, this object will follow
 * sever-side User specification
 * 
 * @type server-side User object
 */
var user;

// Login check
requestUserdata();





/******************** JavaScript and DOM manipulation *********************/

/* List of functions for DOM manipulation
 *
 * decorateProfile		- updates the profile section
 * onReceivedPlayerList	- inflates the online players' section
 * sendGameRequest		- sends a game request to an user
 * onReceivedGameRequest	- when the client receives a game request
 * onLogoutButtonPress	- when the user presses the logout button
 * 
 */

/**
 * This function updates the profile section of the page.
 */
function decorateProfile() {
    $('#profile-username').html(user.__username);
    // other profile related stuff
}

/**
 * This function is called when the 
 * 
 * @param{object} playerList - 'onlineUsers' object form the server
 */
function onReceivedPlayerList(playerList) {

    // Clear the UI
    $('#onlinePlayers-list').empty();

    // generate new list on the UI
    var listIsInflated = false;
    for (var p in playerList) {

        // excluding self from appearing on the list
        // and players that are in a game
        if (p !== user.__username && !playerList[p].__isInGame) {
            $('#onlinePlayers-list').append(makeOnlineUserRow(playerList[p]));
            listIsInflated = true;
        }

    }

    if (!listIsInflated) {
        $('#onlinePlayers-list').html("No one is online").css("text-align", "center");
        return;
    }

    /**
     * Creates a row for the online users' section
     *
     * @param {object} forUser - User object (follows server-side User object standards)
     */
    function makeOnlineUserRow(forUser) {

        // A row for the player
        var div = $(document.createElement('div'));
        div.addClass("onlinePlayers-row");

        // Username
        var usernameText = $(document.createElement('div'));
        usernameText.html(forUser.__username);
        usernameText.attr("class", "onlinePlayers-username");

        // Button to send request
        var reqButton = makeInvitationButton(forUser);

        // Nesting DOM elements. All that goes in a row for each player
        div.append(usernameText);
        div.append(reqButton);
        div.append($(document.createElement('div')).attr("class", "clearFloat"));

        return div;
    }

}



/**
 * Creates a button to challenge a user
 *
 * @param {object} forUser - User object (follows server-side User object standards)
 */
function makeInvitationButton(forUser) {

    // A button to send game request
    var reqButton = $(document.createElement('div'));

    reqButton.attr("class", "button_sendRequest");
    reqButton.html("Send Invitation");

    reqButton.click(function () {


//        hideLobbyBody();
        applyScreenLock();


        // asking for board size

        var notification;

        var buttons = [
            nfBuilder.makeNotificationButton("9x9", function () {
                sendGameRequest(forUser.__username, 9);
                removeScreenLock();
                notification.remove();
                reqButton.replaceWith(getInvitationSentButton(forUser));
            }).attr("class", "notification_button_general")
                    ,
            nfBuilder.makeNotificationButton("13x13", function () {
                sendGameRequest(forUser.__username, 13);
                removeScreenLock();
                notification.remove();
                reqButton.replaceWith(getInvitationSentButton(forUser));
            }).attr("class", "notification_button_general")
                    ,
            nfBuilder.makeNotificationButton("19x19", function () {
                sendGameRequest(forUser.__username, 19);
                removeScreenLock();
                notification.remove();
                reqButton.replaceWith(getInvitationSentButton(forUser));
            }).attr("class", "notification_button_general")
        ];



        notification = nfBuilder.makeNotification("Please select A board Size", "", buttons).attr("class", "boardSizeNotification");

        $("#notificationCenter").append(notification);

    });

    return reqButton;
}

function hideLobbyBody() {
    $("#lobbyBody").css("display", "none");
}

function showLobbyBody() {
    $("#lobbyBody").css("display", "block");
}

function applyScreenLock() {
    $("#notification-screenLock").css("display", "block");
}

function removeScreenLock() {
    $("#notification-screenLock").css("display", "none");
}

function getInvitationSentButton(toUser) {

    var requestSentButton;

    requestSentButton = $(document.createElement('div'));
    requestSentButton.html("Invitation Sent");
    requestSentButton.attr("class", "button_requestSent");
//    requestSentButton.attr("toUser", toUser);

    socket.on('requestDeclined', function (fromUser) {
        if (toUser.__username === fromUser) {
            requestSentButton.replaceWith(makeRequestDeclinedButton());
        }

    });

    return requestSentButton;
}

function makeRequestDeclinedButton() {
    var requestSentButton;
    requestSentButton = $(document.createElement('div'));
    requestSentButton.html("Request Declined");
    requestSentButton.attr("class", "button_requestDecliend");
    return requestSentButton;
}



/**
 * This function sends a game request to the target user
 *
 * @param {string} toUser - The target user
 * @param {int} boardSize - the size of the board
 */
function sendGameRequest(toUser, boardSize) {
    var data = {
        type: "sendRequest",
        toUser: toUser,
        fromUser: user.__username,
        boardSize: boardSize
    };
    socket.emit("gameRequest", data);
}


function acceptRequest(toUser, boardSize) {
    var data = {
        type: "requestAccepted",
        toUser: toUser,
        fromUser: user.__username,
        boardSize: boardSize
    };
    socket.emit("gameRequest", data);
}

function declineRequest(toUser) {
    var data = {
        type: "requestDeclined",
        toUser: toUser,
        fromUser: user.__username
    };
    socket.emit("gameRequest", data);
}


/**
 * This function is called when the user receives a game request
 * 
 * @param {string} fromUser - username
 * @param {int} boardSize - size of the board
 */
function onReceivedGameRequest(fromUser, boardSize) {

    var gameRequest;

    var title = "";
    var msg = "Game request form <b>" + fromUser + "</b><br>Board size: <b>" + boardSize + "x" + boardSize + "</b>";
    var buttons = [makeAcceptButton(), makeDeclineButton()];

    gameRequest = nfBuilder.makeNotification(title, msg, buttons);
    gameRequest.addClass("gameRequestsNotification");

    $("#gameRequests-wrapper").append(gameRequest);



    function makeAcceptButton() {
        var button = $(document.createElement('div'));
        button.attr("class", "button_acceptRequest");
        button.html("Accept");
        button.click(function () {
            acceptRequest(fromUser, boardSize);
        });
        return button;
    }

    function makeDeclineButton() {
        var button = $(document.createElement('div'));
        button.attr("class", "button_declineRequest");
        button.html("Decline");
        button.click(function () {
            declineRequest(fromUser);
            gameRequest.remove();
        });
        return button;
    }
}


function showPendingGameRequests() {
    console.log("pending game requests"); // todo show pending game requests here
}





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

socket.on('userdata', function (data) {
    user = data;
    sessionStorage.sessionID = user.__socketid;
    
    if(user.__isInGame){
        applyScreenLock();
        var nf = nfBuilder.getInGameNotification();
        $("#notificationCenter").append(nf);
    }
    
    decorateProfile();
    showPendingGameRequests();
});


// Event: When client receives online players' list
socket.on('playerList', function (data) {

    // String to object
    var playerList = JSON.parse(data);

    onReceivedPlayerList(playerList);
});



// The client received a game request
socket.on('gameRequest', function (data) {
    onReceivedGameRequest(data.fromUser, data.boardSize);
});



socket.on('requestAccepted', function () {
    // redirecting to game view
    window.location.href = "/GameView.html";
});



// Log Error if server sends an error message
socket.on('_error', function (data) {
    if (data === "duplicate player") {
        $("body").html("this account is already logged in");
    } else if (data === "player is not online") {
        console.log("player is not in mp-lobby");
    } else if (data === "player no longer available") {
        // todo in a game
    } else if (data === "sessionExpired") {
        hideLobbyBody();

        
        var nf = nfBuilder.getSessionExpiredNotification();
        nf.appendTo("body");
    } else {
        console.log(data);
    }
});


/********************************* Functions **********************************/

/**
 * This function requests server for user data
 */
function requestUserdata() {
    socket.emit("userdata", sessionStorage.sessionID);
}

/****************************** End of Socket IO ******************************/



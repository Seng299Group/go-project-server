
var socket = io();

var user;





if (sessionStorage.isGuest === "true") {

    if (sessionStorage.username === undefined) {
        // Guest and first time landing on this page
        // therefore, do a guest login
        requestNewGuestLogin();
    } else {
        // Redirected to this page or refresh
        // therefore, request user data
        requestUserData(sessionStorage.username);
    }

} else if (sessionStorage.isGuest === "false") {
    // user logged in using username and password
    // therefore, request user data
    requestUserData(sessionStorage.username);
}





/******************************** Button clicks *******************************/

$("#button-hotseat").click(function () {
    sessionStorage.gameMode = "hotseat";
    showBoardSizePickerNotification();
});

$("#button-ai").click(function () {
    sessionStorage.gameMode = "ai";
    showBoardSizePickerNotification();
});

$("#button-network").click(function () {
    sessionStorage.gameMode = "network";
    window.location.href = "/multiplayer_lobby.html";
});



/************************* DOM Manipulating functions *************************/

function showBoardSizePickerNotification() {

    var nfBuilder = new NotificationBuilder();

    var notification;

    var buttons = [
        nfBuilder.makeNotificationButton("9x9", function () {
            sessionStorage.boardSize = 9;
            window.location.href = "/GameView.html";
        }).attr("class", "notification_button_general")
                ,
        nfBuilder.makeNotificationButton("13x13", function () {
            sessionStorage.boardSize = 13;
            window.location.href = "/GameView.html";
        }).attr("class", "notification_button_general")
                ,
        nfBuilder.makeNotificationButton("19x19", function () {
            sessionStorage.boardSize = 19;
            window.location.href = "/GameView.html";
        }).attr("class", "notification_button_general")
    ];

    notification = nfBuilder.makeNotification("Please select A board Size", "", buttons).attr("class", "boardSizeNotification");

    applyScreenLock();
    $("#notificationCenter").append(notification);

}

function applyScreenLock() {
    $("#notification-screenLock").css("display", "block");
}

function removeScreenLock() {
    $("#notification-screenLock").css("display", "none");
}

function violatingFlow() {
    console.log("viloating flow. session isStorage is undefined");
    alert("viloating flow"); // for dev purposes // todo remove
    // todo session expired
}

function requestNewGuestLogin() {
    socket.emit('guestLogin', 'guest login');
    socket.on('guestLogin', function (data) {
        console.log(data);
        user = data;
        sessionStorage.username = user.__username;
        sessionStorage.sessionID = user.__socketid;
    });
}

function requestUserData(username) {

    socket.emit("userdataForUsername", username);

    socket.on('userdataForUsername', function (data) {
        sessionStorage.sessionID = data.__socketid; // todo clean
        user = data;

        if (user.__isInGame === true) {
            applyScreenLock();
            var nfBuilder = new NotificationBuilder();
            var nf = nfBuilder.getInGameNotification();
            $("#notificationCenter").append(nf);
        }

    });
}
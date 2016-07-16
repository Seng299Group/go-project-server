// Guest log in

// call server

var socket = io();
var user;

if (sessionStorage.sessionID === undefined) { // new user

    socket.emit('guestLogin', 'guest login');

    socket.on('guestLogin', function (data) {
        console.log(data);
        sessionStorage.sessionID = data.__socketid;
        user = data;
    });

} else { // 

    socket.emit("userdata", sessionStorage.sessionID);

    socket.on('userdata', function (data) {
        console.log(data);
//        sessionStorage.sessionID = data.__socketid;
        user = data;

        if (user.__isInGame === true) {

            var nfBuilder = new NotificationBuilder();

            var nf;

            var title = "You are currently in a game";
            var msg = "Please return to the game";
            var button = nfBuilder.makeNotificationButton("Return to the game", function () {
                window.location.href = "/GameView.html";
            });
            button.addClass("leftGameInProgressNotification-button");

            nf = nfBuilder.makeNotification(title, msg, button);
            nf.addClass("leftGameInProgressNotification");

            nf.appendTo("body");
        }

    });

    console.log("returning user " + sessionStorage.sessionID); // todo handle returning user
}

$("#button-hotseat").click(function () {




//
//    var nf = (new NotificationBuilder()).getBoardSizePickerNotification();
//    $("#notificationCenter").append(nf);
//
//    $("#notification-screenLock").css("display", "block");
//
//    sessionStorage.gameMode = "hotseat";
//    sessionStorage.boardSize = "hotseat";

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



function applyScreenLock() {
    $("#notification-screenLock").css("display", "block");
}

function removeScreenLock() {
    $("#notification-screenLock").css("display", "none");
}

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

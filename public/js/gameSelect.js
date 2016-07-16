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

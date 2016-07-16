// Guest log in

// call server

var socket = io();
var user;

if (sessionStorage.sessionID === undefined) { // new user

    (function () { // for pacakaging
        socket.emit('guestLogin', 'guest login');

        socket.on('guestLogin', function (data) {
            console.log(data);
            sessionStorage.sessionID = data.__socketid;
            user = data;
        });
    })();


} else { // 

    (function () { // for pacakaging
        socket.emit("userdata", sessionStorage.sessionID);

        socket.on('userdata', function (data) {
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
    })();

}

$("#button-hotseat").click(function () {
    sessionStorage.gameMode = "hotseat";
    window.location.href = "/GameView.html";
});

$("#button-ai").click(function () {
    sessionStorage.gameMode = "ai";
    window.location.href = "/GameView.html";
});

$("#button-network").click(function () {
    sessionStorage.gameMode = "network";
    window.location.href = "/multiplayer_lobby.html";
});
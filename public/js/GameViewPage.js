
/*
 * JavasScript file that runs the GameView.html file
 */

// Variables
var socket = io();
var user;

var nfBuilder = new NotificationBuilder();


// Requesting user data
socket.emit("userdataForUsername", sessionStorage.username);

// onReceive user data
socket.on('userdataForUsername', function (data) {
    sessionStorage.sessionID = data.__socketid;
    user = data;
});



// Game modes
if (sessionStorage.gameMode === "hotseat") {

    (function () {

        var boardSize = sessionStorage.boardSize;

        // cleaning up variables
        delete(sessionStorage.gameMode);
        delete(sessionStorage.boardSize);

        // Model - The board
        var myGameSpace = new GameSpace(boardSize);

        // Controller - Game controller
        var gameController = new HotSeatGameController();

        // View
        var view = new View();

        view.setGameSpace(myGameSpace);
        view.setController(gameController);
        view.init();
        view.draw(); // Draws the empty board
        view.drawButtons();

        gameController.setGameSpace(myGameSpace);
        gameController.setView(view);

        $("#canvas").click(function (e) {
            // Clicked coordinates
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;

            view.onBoardClick(x, y);
        });


        // todo this is repeating 3 times, move to global scope
        $("#leftButton").click(function () {
            var leftButton = document.getElementById('leftButton');
            var rightButton = document.getElementById('rightButton');

            if (myGameSpace.__gameOver && leftButton.innerHTML == "<i style=\"font-size: 44px;\" class=\"fa fa-refresh\" aria-hidden=\"true\">Start From Beginning</i>") {
                leftButton.innerHTML = "<i style=\"font-size: 44px;\" class=\"fa fa-chevron-circle-left\" aria-hidden=\"true\">Reverse</i>";
                rightButton.innerHTML = "<i style=\"font-size: 44px;\" class=\"fa fa-chevron-circle-right\" aria-hidden=\"true\">Forward</i>";
                gameController.startReplay();
            } else if (myGameSpace.__gameOver) {
                gameController.rewind();
            } else {
                gameController.pass();
            }
        });
        $("#rightButton").click(function () {
            if (myGameSpace.__gameOver) {
                gameController.replay();
            } else {
                gameController.resign();
                view.changeToReplayButtons();
            }
        });
        $("#middleButton").click(function () {
            window.location.href = "/gameSelect.html";
        });

    })();






} else if (sessionStorage.gameMode === "ai") {

    (function () {

        var boardSize = parseInt(sessionStorage.boardSize);
        delete(sessionStorage.gameMode);
        delete(sessionStorage.boardSize);

        // Model - The board
        var myGameSpace = new GameSpace(boardSize);

        // Controller - Game controller
        var gameController = new AIGameController();

        // View
        var view = new View();

        view.setGameSpace(myGameSpace);
        view.setController(gameController);
        view.init();
        view.draw(); // Draws the empty board
        view.drawButtons();

        gameController.setGameSpace(myGameSpace);
        gameController.setView(view);

        $("#canvas").click(function (e) {
            // Clicked coordinates
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;

            view.onBoardClick(x, y);
        });

        // todo this is repeating 3 times, move to global scope
        $("#leftButton").click(function () {
            var leftButton = document.getElementById('leftButton');
            var rightButton = document.getElementById('rightButton');

            if (myGameSpace.__gameOver && leftButton.innerHTML == "<i style=\"font-size: 44px;\" class=\"fa fa-refresh\" aria-hidden=\"true\">Start From Beginning</i>") {
                leftButton.innerHTML = "<i style=\"font-size: 44px;\" class=\"fa fa-chevron-circle-left\" aria-hidden=\"true\">Reverse</i>";
                rightButton.innerHTML = "<i style=\"font-size: 44px;\" class=\"fa fa-chevron-circle-right \" aria-hidden=\"true\">Forward</i>";
                gameController.startReplay();
            } else if (myGameSpace.__gameOver) {
                gameController.rewind();
            } else {
                gameController.pass();
            }
        });
        $("#rightButton").click(function () {
            if (myGameSpace.__gameOver) {
                gameController.replay();
            } else {
                gameController.resign();
                view.changeToReplayButtons();
            }
        });
        $("#middleButton").click(function () {
            window.location.href = "/gameSelect.html";
        });
    })();







} else if (sessionStorage.gameMode === "network") {

    (function () {

        console.log("network game acting like hotseat");

        // requesting user data
        socket.emit("userdata", sessionStorage.sessionID);

        // onReceive user data
        socket.on('userdata', function (data) {
            user = data;
            sessionStorage.sessionID = user.__socketid;

            render();
        });

        function render() {
            // todo fixme
            // change from hotseat to network

            // fixme note: the "user" variable has __username and __opponent

            // Model - The board
            console.log(user);
            var myGameSpace = new GameSpace(user.__boardSize);
            var player = 1;

            // Controller - Game controller
            var gameController = new NetworkGameController(socket);


            // View
            var view = new View();

            view.setGameSpace(myGameSpace);
            view.setController(gameController);
            view.init();
            view.draw(); // Draws the empty board
            view.drawButtons();

            gameController.setGameSpace(myGameSpace);
            gameController.setView(view);

            $("#canvas").click(function (e) {
                // Clicked coordinates
                var x = e.pageX - $(this).offset().left;
                var y = e.pageY - $(this).offset().top;

                view.onBoardClick(x, y);
            });

            // todo this is repeating 3 times, move to global scope
            $("#leftButton").click(function () {
                var leftButton = document.getElementById('leftButton');
                var rightButton = document.getElementById('rightButton');

                if (myGameSpace.__gameOver && leftButton.innerHTML == "<i style=\"font-size: 44px;\" class=\"fa fa-refresh\" aria-hidden=\"true\">Start From Beginning</i>") {
                leftButton.innerHTML = "<i style=\"font-size: 44px;\" class=\"fa fa-chevron-circle-left\" aria-hidden=\"true\">Reverse</i>";
                rightButton.innerHTML = "<i style=\"font-size: 44px;\" class=\"fa fa-chevron-circle-right\" aria-hidden=\"true\">Forward</i>";
                gameController.startReplay();
                } else if (myGameSpace.__gameOver) {
                    gameController.rewind();
                } else {
                    gameController.pass();
                }
            });
            $("#rightButton").click(function () {
                if (myGameSpace.__gameOver) {
                    gameController.replay();
                } else {
                    gameController.resign();
                    view.changeToReplayButtons();
                }
            });
            $("#middleButton").click(function () {
                window.location.href = "/gameSelect.html";
            });
        }

        // todo update __isOnline flag on the server when the game is over

        // when the game ends, delete session's game mode using the following code
        // delete(sessionStorage.gameMode);
    })();




} else {
//    console.log("gamemode not specIfied. Reasons: bookmarked or manually typed in the url");
    console.log("unknow gamemode: " + sessionStorage.gameMode);

    var nf = nfBuilder.getSessionExpiredNotification();
    nf.appendTo("body");

}

/**
 * This function creates and shows the winner notification on the screen.
 * 
 * @param {object} data - information to display.
 * Should conform to the following specs: 
 * data = {
 *      p1Username: string,
 *      p2Username: string,
 *      p1Score: number,
 *      p2Score: number,
 *      winner: string
 * }
 */
function showWinnerNotification(data) {

//    var data = {
//        p1Username: "Tim",
//        p2Username: "Bob",
//        p1Score: "10",
//        p2Score: "20",
//        winner: "Bob"
//    };
    // todo dev purpose todo delete
	
	var nf;
	
    $("#notification-screenLock").css("display", "block");

    var title = "Game over";

    var msg = data.p1Username + " : " + data.p1Score;
    msg += "<br>" + data.p2Username + " : " + data.p2Score;
    msg += "<br><br> The winner is: " + data.winner;

    function onClose() {
        window.location.href = "/gameSelect.html";
    }

    function onReplay() {
        // Removing the gray screen lock
        $("#notification-screenLock").css("display", "none");
		nf.remove();
		
		var leftButton = document.getElementById('leftButton');
		var rightButton = document.getElementById('rightButton');
		leftButton.innerHTML = "<i style=\"font-size: 44px;\" class=\"fa fa-refresh\" aria-hidden=\"true\">Start From Beginning</i>";
		rightButton.innerHTML = "";
    }

    var buttons = [
        nfBuilder.makeNotificationButton("Return", onClose).attr("class", "leftGameInProgressNotification-button"),
        nfBuilder.makeNotificationButton("Replay", onReplay).attr("class", "leftGameInProgressNotification-button")
    ];

    nf = nfBuilder.makeNotification(title, msg, buttons).attr("class", "leftGameInProgressNotification");

    $("#notificationCenter").append(nf);
}

/**
 * This function is called when the opponent leaves a network game
 */
function showUserLeftNotification() {
    // todo implement
}

/*
 * JavasScript file that runs the GameView.html file
 */

// Variables
var socket = io();
var user;



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

        gameController.setGameSpace(myGameSpace);
        gameController.setView(view);

        $("#canvas").click(function (e) {
            // Clicked coordinates
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;

            view.onBoardClick(x, y);
        });
    })();






} else if (sessionStorage.gameMode === "ai") {

    (function () {

        var boardSize = sessionStorage.boardSize;
        delete(sessionStorage.gameMode);
        delete(sessionStorage.boardSize);

        // Model - The board
        var myGameSpace = new GameSpace(boardSize);
        var player = 1;

        // Controller - Game controller
        var gameController = new AIGameController();

        // View
        var view = new View();

        view.setGameSpace(myGameSpace);
        view.setController(gameController);
        view.init();
        view.draw(); // Draws the empty board

        gameController.setGameSpace(myGameSpace);
        gameController.setView(view);

        $("#canvas").click(function (e) {
            // Clicked coordinates
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;

            view.onBoardClick(x, y);
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

            gameController.setGameSpace(myGameSpace);
            gameController.setView(view);

            $("#canvas").click(function (e) {
                // Clicked coordinates
                var x = e.pageX - $(this).offset().left;
                var y = e.pageY - $(this).offset().top;

                view.onBoardClick(x, y);
            });
        }

        // todo update __isOnline flag on the server when the game is over

        // when the game ends, delete session's game mode using the following code
        // delete(sessionStorage.gameMode);
    })();




} else {
//    console.log("gamemode not specIfied. Reasons: bookmarked or manually typed in the url");
    console.log("unknow gamemode: " + sessionStorage.gameMode);

    var nfBuilder = new NotificationBuilder();
    var nf = nfBuilder.getSessionExpiredNotification();
    nf.appendTo("body");

}

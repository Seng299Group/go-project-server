if (sessionStorage.gameMode === "hotseat") {
    // Model - The board
    var myGameSpace = new GameSpace(9);
    var player = 1;

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





} else if (sessionStorage.gameMode === "ai") {
    console.log("ai game play");





} else if (sessionStorage.gameMode === "network") {

    var socket = io();
    var user;

    (function requestUserdata() {
        socket.emit("userdata", sessionStorage.sessionID);
    })();

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
    }

    // todo update __isOnline flag on the server when the game is over




} else {
    console.log("gamemode not specified. Reasons: bookmarked or manually typed in the url");
}
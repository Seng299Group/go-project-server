if (sessionStorage.gameMode === "hotseat") {

    (function () { // for packaging

        delete(sessionStorage.gameMode);

        console.log("hotseat");

        // Model - The board
        var myGameSpace = new GameSpace(9); // todo game size
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
    })();






} else if (sessionStorage.gameMode === "ai") {

    (function () { // for packaging 
        delete(sessionStorage.gameMode);
//    console.log("ai game play");

        // Model - The board
        var myGameSpace = new GameSpace(9); // todo game size
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

    (function () { // for packaging 
        console.log("network game acting like hotseat");

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

        // when the game ends, delete session's game mode using the following code
        // delete(sessionStorage.gameMode);
    })();




} else {
//    console.log("gamemode not specIfied. Reasons: bookmarked or manually typed in the url");


    var nfBuilder = new NotificationBuilder();
    var nf = nfBuilder.getSessionExpiredNotification();
    nf.appendTo("body");

}
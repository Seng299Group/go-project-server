class NetworkGameController extends GameController {

    /* Inherited Variables:
    * __gameSpace, __view, and __playerTurn
    * See GameController for details
    *
    */

    constructor (socket) {
        super();
        this.__socket = new GameSocket(this, socket)

        this.__localPlayer = user.__playerNumber;
        this.__remotePlayer = user.__playerNumber % 2 + 1;
    }


    placeToken(player, x, y){
        //

        var data;

        var moveAccepted = this.__gameSpace.placeToken(this.__localPlayer, x, y);

        if (moveAccepted) {

            this.__gameSpace.getBoard().print();
			
			this.swapTurn();
            data = {
                //FIXME: player is the name of the local player's account
                fromUser: user.__username,
                toUser: user.__opponent,
                move: {
                    x: x,
                    y: y,
                    c: this.__localPlayer,
                    pass: 'false'
                }
            };

            //call socket function that sends move to server
            this.__socket.emit('move', data);

            //TODO: LOCK INTERFACE!

        } else {
            // todo: notify user that the move was not accepted
            // and ask to try again.
        }

    }

    receiveMove (x, y) {

        this.__gameSpace.placeToken(this.__remotePlayer, x, y);

		this.swapTurn();
        this.__view.draw();

        //TODO: UNLOCK INTERFACE!

    }

    pass () {

        if (this.__pass) {

            var data = {
                fromUser: user.__username,
                toUser: user.__opponent
            };

            this.declareWinner();
			this.__view.showReplayOptions();
            this.__socket.emit('move', data);

        } else {
            this.__gameSpace.pass();

            var data = {
                //FIXME: player is the name of the local player's account
                fromUser: user.__username,
                toUser: user.__opponent,
                move: {
                    x: 0,
                    y: 0,
                    c: 0,
                    pass: 'true'
                }
            };

            //call socket function that sends move to server
            this.__socket.emit('move', data);

        }
    }

    resign () {

        var data = {
            //FIXME: player is the name of the local player's account
            fromUser: user.__username,
            toUser: user.__opponent,
        };

        console.log("unimplemented method call");
    }

    end () {

        var data = {
            //FIXME: player is the name of the local player's account
            fromUser: user.__username,
            toUser: user.__opponent,
        };

        console.log("unimplemented method call");
    }

    declareWinner () {
        var scores = this.__gameSpace.getScores();

        var displayPackage = {
            p1Username: user.__username,
            p2Username: user.__opponent,
            p1Score: scores.p1Score,
            p2Score: scores.p2Score,
            winnner: null
        };

        displayPackage.winner = scores.winner === this.__localPlayer ? user.__username : user.__opponent;

        showWinnerNotification(displayPackage);
    }

}

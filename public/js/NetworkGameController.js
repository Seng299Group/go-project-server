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

        var data;

        var moveAccepted = this.__gameSpace.placeToken(this.__localPlayer, x, y);

        if (moveAccepted) {

            this.swapTurn();

            data = {
                move: {
                    x: x,
                    y: y,
                    c: this.__localPlayer,
                    pass: false
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

    receiveMove (move) {

        this.swapTurn();

        if (move.pass === false) {
            this.__gameSpace.placeToken(this.__remotePlayer, move.x, move.y);
        }
        else {
            this.__pass = true;
            this.__gameSpace.pass();
        }

        this.__view.draw();

        //TODO: UNLOCK INTERFACE!

    }

    pass () {

        console.log('passing...');
        console.log('this.pass: ', this.__pass);

        if (this.__pass) {

            console.log('2nd consecutive pass')

            this.__socket.emit('gameOver');

            var scores = this.__gameSpace.getScores();

            var results = {
                p1Username: (this.__localPlayer === 1) ? user.__username : user.__opponent,
                p2Username: (this.__localPlayer === 2) ? user.__username : user.__opponent,
                p1Score: scores.p1Score,
                p2Score: scores.p2Score,
                winner: (scores.winner === this.__localPlayer) ? user.__username : user.__opponent
            };

            this.__end(results);

        } else {

            this.swapTurn();

            this.__gameSpace.pass();

            var data = {
                move: {
                    x: 0,
                    y: 0,
                    c: 0,
                    pass: true
                }
            };

            //call socket function that sends move to server
            this.__socket.emit('move', data);

        }
    }

    resign () {

        console.log('resign');

        this.__socket.emit('resign');

        var scores = this.__gameSpace.getScores();

        var results = {
            p1Username: (this.__localPlayer === 1) ? user.__username : user.__opponent,
            p2Username: (this.__localPlayer === 2) ? user.__username : user.__opponent,
            p1Score: scores.p1Score,
            p2Score: scores.p2Score,
            winner: user.__opponent
        };

        this.__end(results);

    }

    receiveResign () {

        console.log('receiveResign');

        var scores = this.__gameSpace.getScores();

        var results = {
            p1Username: (this.__localPlayer === 1) ? user.__username : user.__opponent,
            p2Username: (this.__localPlayer === 2) ? user.__username : user.__opponent,
            p1Score: scores.p1Score,
            p2Score: scores.p2Score,
            winner: user.__username
        };

        this.__end(results);

    }

    receiveGameOver () {

        console.log('receiveGameOver');

        var scores = this.__gameSpace.getScores();

        var results = {
            p1Username: (this.__localPlayer === 1) ? user.__username : user.__opponent,
            p2Username: (this.__localPlayer === 2) ? user.__username : user.__opponent,
            p1Score: scores.p1Score,
            p2Score: scores.p2Score,
            winner: (scores.winner === this.__localPlayer) ? user.__username : user.__opponent
        };

        this.__end(results);

    }

    //sends win/loss data to server
    __end (results) {

        console.log(results);

        showWinnerNotification(results);
        this.__view.changeToReplayButtons();

        if (results.winner === user.__username) {
            this.__socket.emit('addWin');
        }
        else {
            this.__socket.emit('addLoss');
        }

    }

}

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

        this.__view.draw();

        //TODO: UNLOCK INTERFACE!

    }

    pass () {

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

}

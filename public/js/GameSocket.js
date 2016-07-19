class GameSocket {

    /* List of variables
    *
    * __socket  - established socket with the server.
    *   A Socket.io object. Use setSocket()
    *
    */

	constructor (gameController, socket) {

        this.__gameController = gameController;
        this.__socket = socket;

        var that = this;
        // Event: Client receives a move from the opponent
        this.__socket.on('move', function (data) {

                that.__gameController.receiveMove(data.move.x, data.move.y);

        });
    }

    emit (channel, data) {
        this.__socket.emit(channel, data);
    }
}

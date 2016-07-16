
var User = require("./User.js");
var db = require("./DatabaseAdapter.js");



/*
 * List of users that are currently online.
 * 
 * The variable should only contain "User" instances.
 * See the User data structure in "./serverjs/User.js"
 * 
 * var onlineUsers = {
 *		username1: User object,
 *		username2: User object,
 *		...
 * 	}
 */
var onlineUsers = {};



/*
 * This data structure is useful for user's corresponding socket lookup.
 * This data structure contains socketid and username pairs for lookup purposes.
 * The data structure will look like the following during runtime.
 *
 * var socketIDtoUser = {
 *		socketid1: username1,
 *		socketid2: username2,
 *		...
 * 	}
 */
var socketIDtoUsername = {};




function listen(io) {

    io.on('connection', function (socket) {
        // A new user connected to the server here



        /********************** List of Socket IO triggered events *********************
         * 
         * newPlayer		- when client connects and sends its username
         * gameRequest	- when the server receives a game request from a client
         * move			- when user makes a move
         * disconnect	- Socket.io event. When a user disconnects
         * 
         * 
         * 
         ******************** List of events triggered by our server ********************
         *
         * playerList    - List of online players. I.e. sending the 'onlineUsers' variable
         * _error        - any serverside error that the client needs to know about.
         *               E.g. to notify user.
         * 
         *******************************************************************************/






        socket.on('guestLogin', function (data) {
            // Make new user object
            var newUser = new User(getName());
            newUser.setSocketID(socket.id);

            // add user in dictionary
            addUserOnDictionary(newUser, socket.id);

            // respond
            socket.emit('guestLogin', newUser);
        });



        socket.on('accountLogin', function (data) {

            /*
             * data should have user name and password (plain or hashed)
             * i.e.
             * data = {
             *      username: string,
             *      password: string
             * }
             */

            var authSucess = db.authenticate(data.username, data.password);

            if (authSucess) {
                console.log("suc");
                socket.emit("loginSucceeded");
            } else {
                console.log("login failed. login request:");
                console.log(data);
                socket.emit("loginFailed");
            }

        });



        socket.on('userdata', function (socketID) {

//            console.log(socketID);

            var oldSocketID = socketID;
            var username = socketIDtoUsername[oldSocketID];
            var user = onlineUsers[username];
            var newSocketID = socket.id;

            if (user === undefined) {
                socket.emit("_error", "sessionExpired");
            } else {
                user.setIsOnline(true);
                updateDictionary(username, newSocketID);

                socket.emit("userdata", user);
                broadcastOnlinePlayers(socket);
            }


        });



        // Server received a game request from a client
        socket.on('gameRequest', function (data) {
//            console.log(data);
            if (data.type === "sendRequest") {
                // checking if the toUser is online
                if (onlineUsers[data.toUser] === undefined) {
                    socket.emit("_error", "player is not in mp-lobby");
                } else {
                    // update user data
                    onlineUsers[data.fromUser].addToRequestSentList(data.toUser);
                    var newData = {
                        fromUser: data.fromUser,
                        boardSize: data.boardSize
                    };
                    // send game request signal
                    io.sockets.connected[onlineUsers[data.toUser].getSocketID()].emit("gameRequest", newData);
                }
            } else if (data.type === "requestAccepted") {
//                console.log("user accepted");
                if (onlineUsers[data.toUser] === undefined) {
                    socket.emit("_error", "player no longer available");
                } else {

                    // todo decline all pending requests

                    onlineUsers[data.fromUser].setOpponent(data.toUser);
                    onlineUsers[data.toUser].setOpponent(data.fromUser);

                    onlineUsers[data.fromUser].setBoardSize(data.boardSize);
                    onlineUsers[data.toUser].setBoardSize(data.boardSize);

                    onlineUsers[data.fromUser].setIsInGame(true);
                    onlineUsers[data.toUser].setIsInGame(true);

                    // Signal both user that the game has been approved by the server
                    io.sockets.connected[onlineUsers[data.toUser].getSocketID()].emit("requestAccepted");
                    io.sockets.connected[onlineUsers[data.fromUser].getSocketID()].emit("requestAccepted");

                    broadcastOnlinePlayers(socket);
                }
            } else if (data.type === "requestDeclined") {
                // updating status
                onlineUsers[data.toUser].updateRequestStatus(data.fromUser, "declined");

                // telling the client
                io.sockets.connected[onlineUsers[data.toUser].getSocketID()].emit("requestDeclined", data.fromUser);
            }
        });



        // When a user makes a move
        socket.on('move', function (data) {

            /*
             The data should include the following:
             
             data = {
             fromUser: username,
             toUser: username,
             move: object (to be decided data structure)
             }
             
             todo:
             - decide on a data structure
             - send the move
             
             */

            /* Example: to send message to a specific socket id
             
             if (io.sockets.connected[socketid]) {
             io.sockets.connected[socketid].emit('eventName', 'message for the user');
             }
             */

        });



        // Socket.io Event: Disconnect
        socket.on('disconnect', function () {

            var username = socketIDtoUsername[socket.id];
            var user = onlineUsers[username];

            if (user === undefined) {
                console.log("user left after server restart");
            } else {
                user.setIsOnline(false);
                setTimeout(function () {
                    if (!user.isOnline()) { // User left (i.e. not a refresh)
                        removeUserFromDictionary(user.getUsername());
                        broadcastOnlinePlayers(socket);
                    }
                }, 2000);
            }

        });

    });

}


function addUserOnDictionary(user, socketid) {
    onlineUsers[user.getUsername()] = user;
    socketIDtoUsername[socketid] = user.getUsername();
}

function updateDictionary(username, newSocketid) {

    var user = onlineUsers[username];
    var oldSocketID = user.getSocketID();

    user.setSocketID(newSocketid);

    delete(socketIDtoUsername[oldSocketID]);
    socketIDtoUsername[newSocketid] = user.getUsername();

}

function removeUserFromDictionary(username) {

    if (onlineUsers[username] === undefined) {
        console.log("user left after server restart");
    } else {
        var user = onlineUsers[username];
        var socketid = user.getSocketID();

        // todo decline all game requests

        delete(socketIDtoUsername[socketid]);
        delete(onlineUsers[username]);
    }

}

function broadcastOnlinePlayers(socket) {
    socket.emit("playerList", JSON.stringify(onlineUsers));
    socket.broadcast.emit("playerList", JSON.stringify(onlineUsers));
}

var names = [];

function getName() {

    var name = names.shift();

    if (name === undefined) {
        names = [
            "Friendly Ape",
            "Friendly Bear",
            "Friendly Bee",
            "Friendly Bison",
            "Friendly Buffalo",
            "Friendly Butterfly",
            "Friendly Camel",
            "Friendly Caribou",
            "Friendly Cat",
            "Friendly Deer",
            "Friendly Dinosaur",
            "Friendly Eagle",
            "Friendly Falcon",
            "Friendly Giraffe",
            "Friendly Hamster",
            "Friendly Hawk",
            "Friendly Jaguar",
            "Friendly Kangaroo",
            "Friendly Koala",
            "Friendly Lion",
            "Friendly Octopus",
            "Friendly Parrot",
            "Friendly Rabbit",
            "Friendly Raccoon",
            "Friendly Ram",
            "Friendly Raven",
            "Friendly Red deer",
            "Friendly Swan",
            "Friendly Zebra"
        ];

        name = names.shift();
    }

    return name;
}

module.exports = {
    listen: listen
};
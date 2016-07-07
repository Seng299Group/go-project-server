
var http = require("http");

var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);

app.use(express.static("public"));
app.use(bodyParser.json());



var User = require("./serverjs/User.js");
var NetworkAdapter = require("./serverjs/NetworkAdapter.js");





/****************************** Express Routes ********************************/
app.get("/data", function (req, res) {
    res.end("Hello world");
});

app.get("/ai", function (req, res) {
	// Serving with the AI landing page
	
	// todo: change to actual landing page.
    res.sendfile("public/aiTester.html");
});

app.get("/mp", function (req, res) {
    res.sendfile("public/multiplayer_lobby.html");
});





app.post("/ai", function (req, res) {
	
	var userid = req.body.userid; // for user specific actions
	
	var postData = {
        "size": req.body.size,
        "board": req.body.board,
        "last": req.body.last
    };

    var option = {
        host: "roberts.seng.uvic.ca",
        port: "30000",
        path: "/ai/maxLibs",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var cb_onGOAIServerResponse = function (response) {
        var str = "";
		
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on("end", function () {
			// if the response is "Invalid request format."
            if (str === "Invalid request format.") {
                // Log and respond with an error
				console.log("Invalid request format. Request: \n" + JSON.stringify(postData) + "\n");
                res.status(400).json(postData);
            } else {
				// callback with the full response
                res.json(str);
            }
        });
    };

    var myreq = http.request(option, cb_onGOAIServerResponse);
	
    myreq.on("error", function (e) {
        console.log("\nproblem with request \n\n " + e.toString() + "\n");
    });

    myreq.write(JSON.stringify(postData));
	
    myreq.end();
	
});





/*
* List of players that are currently online. The data structure
* will look like the following during runtime.
* 
* var playerList = {
* 		{
* 			username: username	
* 			opponent: username
*			sentGameRequestTo: [username1, username2, ... ]
* 			socketid: Socket ID
*	 	},
* 		{
* 			...
* 		}
* 		...
* 	}
*
*/
var playerList = {};

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
var socketIDtoUser = {};



io.on('connection', function (socket) {
	
	// New user on the server
    socket.on('newPlayer', function (data) {
		
		var i = data.username;
		
		// check if user is already on the server
		if (playerList[i] === undefined){
			
			data.socketid = socket.id;
			playerList[i] = data;
			socketIDtoUser[socket.id] = data.username;
			
			// Send back the player list
			socket.emit("playerList", JSON.stringify(playerList));
			socket.broadcast.emit("playerList", JSON.stringify(playerList));
		} else {
			log("duplicate player");
			socket.emit("_error", "duplicate player");
		}
    });

	
	
	// Server received a game request
	socket.on('gameRequest', function(data) {
		
		if (io.sockets.connected[playerList[data.toUser].socketid] !== undefined){
			playerList[data.fromUser].sentGameRequestTo.push(data.toUser);
			io.sockets.connected[playerList[data.toUser].socketid].emit("gameRequest", data.fromUser);	
		} else {
			socket.emit("_error", "player is not online");
		}
	});
	
	
	
	// When a user makes a move
	socket.on('move', function(data) {
		// todo issue the move to opponent

		/* Example
		if (io.sockets.connected[socketid]) {
			io.sockets.connected[socketid].emit('message', 'for your eyes only');
		}
		*/
	});
	
	
	
	// Socket.io Event: Disconnect
	socket.on('disconnect', function () {
		// Remove user from server
		var user = socketIDtoUser[socket.id];
		delete(playerList[user]);
		delete(socketIDtoUser[socket.id]);
		
		// Send playerList
		socket.broadcast.emit("playerList", JSON.stringify(playerList));
	});

});









/******************************** Port assignment *****************************/
server.listen(3000, function(){
	log("Listening on port 3000");
});





/*********************************** Utils ************************************/
/**
 * This method is simply a shortcut for:
 * console.log(l);
 * @param {var or object} msg - var or object to console-log
 */
function log(msg) {
    console.log(msg);
}
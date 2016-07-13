
var http = require("http");

var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static("public"));
app.use(bodyParser.json());





/****************************** Express Routes ********************************/
app.get("/data", function (req, res) {
    res.end("Hello world");
});

app.get("/ai", function (req, res) {
	// Serving with the AI landing page
	
	// todo: change to actual landing page.
    res.sendfile("public/aiTester.html");
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





/******************************** Port assignment *****************************/
app.listen(30154, function () {
    console.log("Listening on port 30154\n");
});
/******************************* End of Express *******************************/





/*********************************** Utils ************************************/
/**
 * This method is simply a shortcut for:
 * console.log(l);
 * @param {var or object} msg - var or object to console-log
 */
function log(msg) {
    console.log(msg);
}
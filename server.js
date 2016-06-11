
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static("public"));
app.use(bodyParser.json());





/********************************** Express ***********************************/
app.get("/data", function (req, res) {
    res.end("Hello world");
});



/******************************** Port assignment *****************************/
app.listen(3000, function () {
    console.log("Listening on port 3000\n");
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
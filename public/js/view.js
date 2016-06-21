
/********************************* SVG Factory ********************************/
/* Source: SEng 299 Lab 4 */


//  Namespace for SVG elements
var SVGNameSpace = "http://www.w3.org/2000/svg";

/**
 * Makes a new SVG line object and returns it. 
 *
 * @param x1 {number} 
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @param color {string} the color of the line
 * @param stroke {number} the thickness of the line.
 * @returns {object}
 */
function makeLine(x1, y1, x2, y2, color, stroke) {
    var line = document.createElementNS(SVGNameSpace, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.style.stroke = color || "#000000";
    line.style.strokeWidth = stroke || 2;
    return line;
}

/**
 * Makes and returns a new SVG rectangle object. 
 * 
 * @param x {number} the x position of the rectangle.
 * @param y {number} the y position of the rectangle.
 * @param w {number} the width of the rectangle.
 * @param h {number} the height of the rectangle.
 * @param c {string} the color of the rectangle. 
 * 
 * @return {object} 
 */
function makeRectangle(x, y, w, h, c) {
    var rect = document.createElementNS(SVGNameSpace, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.style.fill = c;
    return rect;
}

/**
 * Makes and returns a new SVG circle object. 
 * 
 * @param x {number} the x position of the circle.
 * @param y {number} the y position of the circle.
 * @param r {number} the radius 
 * @param c {number} the color 
 * @param stroke {number} the thickness of the line.
 * 
 * @return {object} 
 */
function makeCircle(x, y, r, c, stroke) {
    var circ = document.createElementNS(SVGNameSpace, "circle");
    circ.setAttribute("cx", x);
    circ.setAttribute("cy", y);
    circ.setAttribute("r", r);
    circ.style.fill = c;
    circ.style.stroke = stroke;
    circ.style.strokeWidth = 3;
    return circ;
}

/**
 * Makes an SVG element. 
 * 
 * @param w {number} the width
 * @param h {number} the height 
 * 
 * @return {object} 
 */
function makeSVG(w, h) {
    var s = document.createElementNS(SVGNameSpace, "svg");
    s.setAttribute("width", w);
    s.setAttribute("height", w);
    s.setAttribute('xmlns', SVGNameSpace);
    s.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
    return s;
}

/***************************** End of SVG Factory *****************************/





/********************************** Drawing ***********************************/
// HTML Div
var canvas = $("#canvas");
var W = 600, H = 600;
canvas.css("height", H);
canvas.css("width", W);

// HTML SVG object
var svg = $(makeSVG(W, H));

// Measurements for drawing purposes
var scale, radius, offset;



/**
 * This function initializes all that are needed for drawing.
 * 1. Calculates necessary variables from the size of the board.
 * 2. Puts the svg object inside the canvas div
 * 
 * @param {type} board - a GameSpace instance
 */
function init(board) {
    // 1. Variables
    scale = W / board.size;
    radius = (scale / 2) - 1;
    offset = scale / 2;

    // 2. append the svg object to the canvas div.
    canvas.append(svg);
}

/**
 * This function draws any given board state i.e. a GameSpace object.
 * This function:
 * 1. Extracts the board state from the GameSpace object.
 * 2. Clears the svg object. This is done to prevent duplicate sub-svg objects
 *      (i.e. lines and previously placed stones)
 * 3. Draw lines
 * 4. Draw stones
 * 
 * @param {object} board - A GameSpace object
 */
function draw(board) {

    // 1. Extracting the board representation
    board = board.board.board;

    // 2. Clearing SVG
    svg.html("");

    // 3. Drawing lines
    for (var i = 0; i < board.length; i++) {
        var line_v = makeLine((scale * i) + offset, offset, (scale * i) + offset, H - offset, "black", "black");
        var line_h = makeLine(offset, (i * scale) + offset, W - offset, (i * scale) + offset, "black", "black");
        svg.append(line_v);
        svg.append(line_h);
    }

    // 4. Drawing stones
    for (var col in board) {
        for (var row in board[col]) {
            if (board[col][row] === 1) {
                // black stone
                var circ = makeCircle((row * scale) + offset, (col * scale) + offset, radius, "black", "black");
                svg.append(circ);

            } else if (board[col][row] === 2) {
                // white stone
                var circ = makeCircle((row * scale) + offset, (col * scale) + offset, radius, "white", "black");
                svg.append(circ);
            }
        }
    }
}
/******************************* End of drawing *******************************/





/********************************** Testing ***********************************/
// The board
var myBoard = new GameSpace(9);
var player = 1;

// Initializing view variables for the given board
init(myBoard);

// Drawing the board
draw(myBoard);

// onClick event on the board
$("#canvas").click(function (e) {

    // Calculating the board coordinates from clicked coordinates
    var x = Math.floor((e.pageX - $(this).offset().left) / (offset * 2));
    var y = Math.floor((e.pageY - $(this).offset().top) / (offset * 2));

    // console.log(posX + " " + posY);

    // Placing the token on the board
    myBoard.placeToken(player, x, y);

    // Draw board
    draw(myBoard);

    // Swapping players
    if (player === 1) {
        player = 2;
    } else if (player === 2) {
        player = 1;
    }

});





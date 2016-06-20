
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
 * Makes and returns a new SVG rectange object. 
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





/**
 * This function takes a GameSpace object and renders the board
 * on the HTML page.
 * 
 * Precondition: The HTML page must include a div element with "canvas" as its id.
 * 
 * @param {object} board - A GameSpace object
 */
function draw(board) {

    // Extracting the array representation of the board
    board = board.board.board;
    // console.log(board);

    // The canvas element
    var canvas = $("#canvas");
    var W = 600, H = 600;
    canvas.css("height", H);
    canvas.css("width", W);

    // Creating the svg element
    var svg = $(makeSVG(W, H));

    // Draw related variables
    var scale = W / board.length;
    var radius = (scale / 2) - 1;
    var offset = scale / 2;

    // Lines
    for (var i = 0; i < board.length; i++) {

        var line_v = makeLine((scale * i) + offset, offset, (scale * i) + offset, H - offset, "black", "black");
        var line_h = makeLine(offset, (i * scale) + offset, W - offset, (i * scale) + offset, "black", "black");
        svg.append(line_v);
        svg.append(line_h);
    }

    // Stones
    for (var col in board) {
        for (var row in board[col]) {

            if (board[col][row] === 1) {
                // black stones
                var circ = makeCircle((row * scale) + offset, (col * scale) + offset, radius, "black", "black");
                svg.append(circ);

            } else if (board[col][row] === 2) {
                // white stones
                var circ = makeCircle((row * scale) + offset, (col * scale) + offset, radius, "white", "black");
                svg.append(circ);
            }

        }
    }

    // append the svg object to the canvas object.
    canvas.append(svg);

}




// Testing
var myBoard = new GameSpace(9);

myBoard.placeToken(1, 2, 5);
myBoard.placeToken(2, 4, 5);
myBoard.placeToken(1, 3, 4);
myBoard.placeToken(2, 3, 6);
myBoard.placeToken(1, 4, 3);
myBoard.placeToken(2, 2, 3);

draw(myBoard);


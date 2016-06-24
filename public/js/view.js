'use strict'

class View {
	
	/* List of Variables
	*
	* __board 		- a GameSpace instance. Use setBoard()
	* __controller	- a GameController instance. Use setController()
	*
	* __canvas		- HTML div with 'canvas' as id
	* __W			- width of the canvas
	* __H			- height of the canvas
	* __svg			- A SVG object under the canvas object.
	* 
	* __scale		- A scaling factor. (Pixel between lines on the board)
	* __radius		- The radius of the stone. (Unit: px)
	* __offset		- Offset to account for borders of the board. (Unit: px)
	*
	*/
	
	
	
	/**
	* Sets the board for the instance.
	*
	* @param {object} board - A GameSpace object.
	*/
	setBoard(board){
		this.__board = board;
	}
	
	/**
	* Returns the board of the instance.
	*
	* @returns {object} - A GameSpace object.
	*/
	getBoard(){
		return this.__board;
	}
	
	/**
	* Sets the controller for this instance.
	* 
	* @param {object} controller - A GameController object.
	*/
	setController(controller){
		this.__controller = controller;
	}
	
	/**
	* Returns the controller of the instance.
	* 
	* @returns {object} - A GameController object.
	*/
	getController(){
		return this.__controller;
	}
	
	
		
	/**
	 * This function initializes the View.
	 * 
	 * Precondition: the setBoard() method must be called before calling
	 * 		this method.
	 */
	init(){
		// HTML Div
		this.__canvas = $("#canvas");
		this.__W = 600;
		this.__H = 600;
		this.__canvas.css("height", this.__H);
		this.__canvas.css("width",this.__W);

		// HTML SVG object
		this.__svg = $(makeSVG(this.__W, this.__H));

		// Drawing variables
		this.__scale =this.__W / this.__board.size;
		this.__radius = (this.__scale / 2) - 1;
		this.__offset = this.__scale / 2;
		this.__canvas.append(this.__svg);
	}
	
	/**
	 * This function draws the board.
	 * This function:
	 * 1. Extracts the board state from the GameSpace object.
	 * 2. Clears the svg object. This is done to prevent duplicate sub-svg objects
	 *      (i.e. lines and previously placed stones)
	 * 3. Draw lines
	 * 4. Draw stones
	 */
	draw() {

		// 1. Extracting the board representation
		var boardArray = this.__board.getBoard().getGrid();
		
		// 2. Clearing SVG
		this.__svg.empty();

		// 3. Drawing lines
		for (var i = 0; i < boardArray.length; i++) {
			var line_v = makeLine((this.__scale * i) + this.__offset, this.__offset, (this.__scale * i) + this.__offset, this.__H - this.__offset, "black", "black");
			var line_h = makeLine(this.__offset, (i * this.__scale) + this.__offset,this.__W - this.__offset, (i * this.__scale) + this.__offset, "black", "black");
			this.__svg.append(line_v);
			this.__svg.append(line_h);
		}

		// 4. Drawing stones
		for (var col in boardArray) {
			for (var row in boardArray[col]) {
				if (boardArray[col][row] === 1) {
					// black stone
					var circ = makeCircle((row * this.__scale) + this.__offset, (col * this.__scale) + this.__offset, this.__radius, "black", "black");
					this.__svg.append(circ);

				} else if (boardArray[col][row] === 2) {
					// white stone
					var circ = makeCircle((row * this.__scale) + this.__offset, (col * this.__scale) + this.__offset, this.__radius, "white", "black");
					this.__svg.append(circ);
				}
			}
		}
	}
	
	/**
	* This method should be called when the view is click.
	* The click event should be handled from here.
	* Currently:
	* 1. Places a stone
	* 2. Draws the board
	* 3. Swaps player's turn
	*/
	onBoardClick(x, y){
		// Converting to board coordinate
		var posx = Math.floor(x / (this.__offset * 2));
        var posy = Math.floor(y / (this.__offset * 2));
		// Placing the stone
		this.__board.placeToken(this.__controller.getPlayerTurn(), posx, posy);
		
		// Drawing the board
		this.draw();
		
		// Swapping turns
		this.__controller.swapTurn();
	}
}
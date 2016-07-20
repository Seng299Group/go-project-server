'use strict'

class View {

    /* List of Variables
     *
     * __gameSpace 		- a GameSpace instance. Use setGameSpace()
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
     * Sets the GameSpace for the view instance.
     *
     * @param {object} gameSpace - A GameSpace object.
     */
    setGameSpace(gameSpace){
        this.__gameSpace = gameSpace;
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
     * This function initializes the View.
     * 
     * Precondition: the setGameSpace() method must be called before calling
     * 		this method.
     */
    init(){
        // HTML Div
        this.__canvas = $("#canvas");
        this.__W = 600;
        this.__H = 600;
        this.__canvas.css("height", this.__H);
        this.__canvas.css("width", this.__W);

        // HTML SVG object
        this.__svg = $(makeSVG(this.__W, this.__H));

        // Drawing variables
        this.__scale = this.__W / this.__gameSpace.size;
        this.__radius = (this.__scale / 2) - 1;
        this.__offset = this.__scale / 2;
        this.__canvas.append(this.__svg);

        //SVG Colours
        this.__p1Colour = "black";
        this.__p2Colour = "white";
        this.__currentPlayer = 1; //Player Who's Colour is to be Changed
    }

    /**
     * This function draws the board on screen.
     * This function:
     * 1. Extracts the board state from the GameSpace object.
     * 2. Clears the svg object. This is done to prevent duplicate sub-svg objects
     *      (i.e. lines and previously placed stones)
     * 3. Draw lines
     * 4. Draw stones
     */
    draw() {

        // 1. Extracting the board representation
        var boardArray = this.__gameSpace.getBoard().getGrid();

        // 2. Clearing SVG
        this.__svg.empty();

		//
		var canvas = makeRectangle(this.__offset, this.__offset, (this.__W - 2 * this.__offset), (this.__H - 2 * this.__offset), "white");
		this.__svg.append(canvas);
        // 3. Drawing lines (intersections)
        for (var i = 0; i < boardArray.length; i++) {
            var line_v = makeLine((this.__scale * i) + this.__offset, this.__offset, (this.__scale * i) + this.__offset, this.__H - this.__offset, "black", "black");
            var line_h = makeLine(this.__offset, (i * this.__scale) + this.__offset, this.__W - this.__offset, (i * this.__scale) + this.__offset, "black", "black");
            this.__svg.append(line_v);
            this.__svg.append(line_h);
        }

        // 4. Drawing stones
        for (var col in boardArray) {
            for (var row in boardArray[col]) {
                if (boardArray[col][row] === 1) {
                    // black stone
                    var circ = makeCircle((row * this.__scale) + this.__offset, (col * this.__scale) + this.__offset, this.__radius, this.__p1Colour, "black");
                    this.__svg.append(circ);
                } else if (boardArray[col][row] === 2) {
                    // white stone
                    var circ = makeCircle((row * this.__scale) + this.__offset, (col * this.__scale) + this.__offset, this.__radius, this.__p2Colour, "black");
                    this.__svg.append(circ);
                }
            }
        }
		
		this.indicatePlayer();
		//this.playerNames();
    }

	indicatePlayer(){
		if(this.__controller.__playerTurn === 1){
			document.getElementById("c1").style.visibility = "hidden";
			document.getElementById("c2").style.visibility = "visible";
		}
		else{
			document.getElementById("c2").style.visibility = "hidden";
			document.getElementById("c1").style.visibility = "visible";
		}
	}
	
	playerNames(){
		document.getElementById("player1").innerHTML = user.__username;
		document.getElementById("player2").innerHTML = user.__opponent;
		console.log(user.__username);
	}
	
    /**
     * This method should be called when the view is clicked.
     * The click event should be handled from here.
     * Currently:
     * 1. Places a stone
     * 2. Draws the board
     */
    onBoardClick(x, y){
        // Converting to board coordinate
        var posx = Math.floor(x / (this.__offset * 2));
        var posy = Math.floor(y / (this.__offset * 2));

        // Placing the stone
	this.__controller.placeToken(this.__controller.getPlayerTurn(), posx, posy);
		
	// Drawing the board
	this.draw();
    }

    showBar(){
        if(document.getElementById("colourButtonTable").style.visibility == "hidden"){
            document.getElementById("sideBar").style.visibility = "visible";
            document.getElementById("colourButtonTable").style.visibility = "visible";
			document.getElementById("backgroundTable").style.visibility = "visible";
		}else{
			document.getElementById("colourButtonTable").style.visibility = "hidden";
			document.getElementById("backgroundTable").style.visibility = "hidden";
			document.getElementById("showBar").style.visibility = "visible";
         }
	}
        
    changeColour(colour){
        if(this.__currentPlayer == 1){
                this.__p1Colour = colour;
        }else{
                this.__p2Colour = colour;
        }
        this.draw();
    }
        
    setPlayer(player){
        this.__currentPlayer = player;
		var playerOneButton = document.getElementById("playerOne");
		var playerTwoButton = document.getElementById("playerTwo");

		if(player == 1){
			playerOneButton.style.backgroundColor = "0F8B8D";
			playerTwoButton.style.backgroundColor = "BFC3BA";
		}else{
			playerOneButton.style.backgroundColor = "BFC3BA";
			playerTwoButton.style.backgroundColor = "0F8B8D";	
		}
    }
	setPageBackround(){
		var page = document;
		page.backgroundImage = "img/go.jpg"
	}
	drawButtons(){
		var buttonBar = document.getElementById('buttonBarWrapper');
		buttonBar.innerHTML = "<div id=leftButton><i class=\"fa fa-thumbs-down fa-6\" aria-hidden=\"true\"><br>Pass</i></div>\
									<div id=middleButton><i class=\"fa fa-sign-in fa-6\" aria-hidden=\"true\"><br>Leave Game</i></div>\
									<div id=rightButton><i class=\"fa fa-hand-paper-o fa-6\" aria-hidden=\"true\"><br>Resign</i></div>";	
	}
	changeToReplayButtons(){
		console.log("Changing to replay");
		var leftButton = document.getElementById('leftButton');
		var rightButton = document.getElementById('rightButton');
		leftButton.innerHTML = "<i class=\"fa fa-refresh fa-6\" aria-hidden=\"true\">Start From Beginning</i>";
		rightButton.innerHTML = "";
	}
	changeToControlButtons(){
		console.log("Changing to control");
		var buttonBar = document.getElementById('buttonBarWrapper');
		buttonBar.innerHTML = "<div id=leftButton>Forward</div>\
								<div id=rightButton>Backward</div>";
	}
}
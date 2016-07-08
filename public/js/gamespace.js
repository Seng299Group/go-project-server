'use strict'

/******************
*
*   This class maintains the physical state of the game
*
*/

class GameSpace {

    /*
    Attributes:
        board - the game board
        size - the size of the game board
        history - an array of previous turns using <GameBoard> objects
		__lastMove - Object containing the last x, y, c, and pass
        p1Captured - The number of armies Player 1 has captured
        p2Captured - The number of armies Player 2 has captured
    */

    //  constructor
    //      Params:
    //          size - the size of the game board
    constructor (size) {

        this.board = new GameBoard(size);
        this.size = size;
        this.history = [];
        this.p1Captured = 0;
        this.p2Captured = 0;
        this.p1Score = 0;
        this.p2Score = 0;
    }

    //  getBoard
    //      Returns the GameBoard object
    getBoard () {
        return this.board;
    }

    //  getBoard
    //      Returns the GameBoard object's grid attribute
    getGrid () {
        return this.board.getGrid();
    }

	/*
	* @returns {object} - the __lastMove variable.
	*/
	getLastMove(){
		return this.__lastMove;
	}

    //  opposingPlayer
    //      Params:
    //          player - 1 or 2, whoever's turn it is
    //      Returns 1 or 2, the opposing player's number
    __opposingPlayer (player) {
        if (player === 1) {
            return 2;
        }
        else {
            return 1;
        }
    }

    // placeToken
    //
    //      Places a token on the space after checking that the move is legal
    //
    //      Params:
    //          player - the player placing a token
    //          x - the x-coordinate where the player is trying to place a token
    //          y - the y-coordinate
    //      Returns:
    //          True if the move was legal and applied
    //          False if the move was illegal and not applied
    placeToken (player, x, y) {

        var captured;

        if (this.checkLegal(player, x, y)) {
            // console.log('Player ' + player + ' placing token at (' + x + ',' + y +')');
			this.__lastMove = {"x":y, "y":x, "c":player, "pass":false}; // temporary fix: x=y and y=x
            this.history.push(this.board);
            this.board = this.board.clone();
            this.board.evaluateMove(player, x, y);
            this.__addCapturedArmies(player);

            // this.board.print();
            return true;
        }
        return false;
    }

    // placeToken
    //
    //      Compares the new board to the previous turn, counting the difference
    //      in the opoponents armies, and adding it to the current player's
    //      capture total
    //
    //      Params:
    //          player - the player capturing armies
    //      Returns:
    //          True if the move was legal and applied
    //          False if the move was illegal and not applied
    __addCapturedArmies (player) {

        var captured;
        var opponent = this.__opposingPlayer(player);

        captured = this.history[this.history.length-1].count(opponent) - this.board.count(opponent);

        if (player === 1) {
            this.p1Captured += captured;
        }
        else {
            this.p2Captured += captured;
        }
    }

    //  koRule
    //      Params:
    //          tempBoard - a gameboard object to be compared with the last one
    //      Returns:
    //          True if this board is different to last turn's
    //          False otherwise
    __koRule (tempBoard) {
        //handles edge case of first move
        if (this.history.length === 0) {
            return true;
        }
        return !GameBoard.equal(tempBoard, this.history[this.history.length - 1]);
    }

    //  evaluationTest
    //
    //      Performs legality checking that requires evaluating the board.
    //      Returns true when:
    //          1) Armies were destroyed, and the Ko Rule is upheld
    //          2) No armies were destroyed, and the space has liberties
    //
    //      Params:
    //          player - the player placing a token
    //          x - the x-coordinate where the player is trying to place a token
    //          y - the y-coordinate
    //      Returns:
    //          True if the move is legal
    //          False otherwise
    __evaluationTest (player, x, y) {

        var captured;
        var opponent = this.__opposingPlayer(player);
        var tempBoard = this.board.clone();
        tempBoard.evaluateMove(player, x, y);

        //The first move is always legal
        if (this.history.length === 0){
            return true;
        }

        captured = this.board.count(opponent) - tempBoard.count(opponent);

        if (captured > 0 ) {
            return this.__koRule(tempBoard);
        }
        else {
            return tempBoard.__countArmyLiberties(player, x, y) > 0;
        }
    }

    //  checkLegal
    //
    //      Tests whether the move is legal
    //
    //      Params:
    //          player - the player placing a token
    //          x - the x-coordinate where the player is trying to place a token
    //          y - the y-coordinate
    //      Returns:
    //          True if the move is legal
    //          False otherwise
    checkLegal (player, x, y) {

        //Is the space occupied?
        if (this.board.get(x, y) !== 0) {
            return false;
        }

        return this.__evaluationTest(player, x, y);

    }
    //ASSUMES P2 IS BLACK
    __hasBlackNeighbours(x, y){
        if (x - 1 > -1) {
            if(this.board.get(x-1, y) === 2){
                return true;
            }
        }
        if (y - 1 > -1) {
            if(this.board.get(x, y-1) === 2){
                return true;
            }
        }
        if (x + 1 < this.size) {
            if(this.board.get(x+1, y) === 2){
                return true;
            }
        }
        if (y + 1 < this.size) {
            if(this.board.get(x, y+1) === 2){
                return true;
            }
        }
        return false;
    }
    //ASSUMES P1 IS WHITE
    __hasWhiteNeighbours(x, y){
        if (x - 1 > -1) {
            if(this.board.get(x-1, y) === 1){
                return true;
            }
        }
        if (y - 1 > -1) {
            if(this.board.get(x, y-1) === 1){
                return true;
            }
        }
        if (x + 1 < this.size) {
            if(this.board.get(x+1, y) === 1){
                return true;
            }
        }
        if (y + 1 < this.size) {
            if(this.board.get(x, y+1) === 1){
                return true;
            }
        }
        return false;
    }
    score(){
        var visited = new GameBoard(this.size);
        for(var row = 0; row < this.size; row++){
            for(var col = 0; col < this.size; col++){
                var hasBlackNeighbours = false;
                var hasWhiteNeighbours = false;

                if(visited.get(row, col) === 0 && this.board.get(row, col) === 0){
                    visited.set(1, row, col);
                    var emptySpaces = this.board.__getArmyCoords(0, row, col);
                    for(var i = 0; i < emptySpaces.length; i++){
                        visited.set(1, emptySpaces[i].x, emptySpaces[i].y);
                        if(this.__hasBlackNeighbours(emptySpaces[i].x, emptySpaces[i].y)){
                            hasBlackNeighbours = true;
                        }
                        if(this.__hasWhiteNeighbours(emptySpaces[i].x, emptySpaces[i].y)){
                            hasWhiteNeighbours = true;
                        }
                        if(hasBlackNeighbours && hasWhiteNeighbours){
                            break;
                        }
                    }
                    if(!(hasBlackNeighbours && hasWhiteNeighbours)){
                        if(hasBlackNeighbours){
                            this.p2Score += emptySpaces.length;
                        }else{
                            this.p1Score += emptySpaces.length;
                        }
                    }
                }
            }
        }
        this.p1Score += this.p1Captured + this.board.count(1);
        this.p2Score += this.p2Captured + this.board.count(2) + 6.5;

        console.log("Player One Score: " + this.p1Score + " Player Two Score: " + this.p2Score);
    }
}

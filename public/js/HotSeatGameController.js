'use strict'

class HotSeatGameController extends GameController {
	
	/* Inherited Variables:
	* __gameSpace, __view, and __playerTurn
	* See GameController for details
	* 
	*/
	
	constructor(){
		super();
	}
	
	/**
	* This method places the token on the board of this instance.
	* 
	* @param {Number} player. 1 is Black and 2 is White
	* @param {Number} x - coordinate on the board.
	* @param {Number} y - coordinate on the board.
	*/
	placeToken(player, x, y){
		
		var validMove = this.__gameSpace.placeToken(player, x, y);
		
		if (validMove){
			this.swapTurn();
		} else {
			// Invalid move.
			
			// todo: Notify user
			console.log("Invalid move.");
		}
		
	}
	
	pass(){
		console.log("unimplemented method call");
	}
	
	resign(){
		console.log("unimplemented method call");
	}
	
	end(){
		console.log("unimplemented method call");
	}
	
}
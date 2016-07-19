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
			this.__pass = false;
			this.swapTurn();
		} else {
			alert("Invalid Move!");
		}
		
	}
	/*
	*	Function Called When a Player Passes
	*	
	* 	Will End Game If Two Consecutive Passes
	*/
	pass(){
		if(this.__pass){
			this.__gameSpace.declareWinner();
			this.__view.changeToReplayButtons();
			//window.location.href = "winnerPage.html";//TODO: Change to Game Selection
		}else{
			this.__pass = true;
		}
	}
	
	resign(){
		this.__gameSpace.__gameOver = true;
		console.log("unimplemented method call: RESIGN");
	}
	
	end(){
		console.log("unimplemented method call");
	}
	
}
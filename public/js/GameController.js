'use strict'

class GameController {
	
	/** List of variables
	* 
	* __gameSpace	- A GameSpace instance. Use setGameSpace()
	* __view		- A view instance. Use setView()
	* 
	* __playerTurn	- indicates the turn of the player. Use getPlayerTurn()
	* 
	*/
	
	constructor() {
		this.__playerTurn = 1; // black
		this.__historySpot = 0; //Temporary Fix
		this.__pass = false; //Set to false if previous turn was not a pass
	}
	
	/**
	* Returns 1 or 2 indicating which player's turn it is.
	* 
	* @returns {Number}
	*/
	getPlayerTurn(){
		return this.__playerTurn;
	}
	
	/**
	* This method swaps the player's turn.
	*/
	swapTurn(){
		//Swapping players
		if (this.__playerTurn === 1) {
		   this.__playerTurn = 2;
		} else if (this.__playerTurn === 2) {
		   this.__playerTurn = 1;
		}
	}
	
	setGameSpace(gameSpace){
		this.__gameSpace = gameSpace;
	}
	
	setView(view){
		this.__view = view;
	}

	replay(){
		var gameHistory = this.__gameSpace.getHistory();
			this.__historySpot += 1;
			if(this.__historySpot < gameHistory.length){
				this.__gameSpace.board = gameHistory[this.__historySpot];
				this.__view.draw();
			}
	}

}

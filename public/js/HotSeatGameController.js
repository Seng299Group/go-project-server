'use strict'

class HotSeatGameController extends GameController {

	/* Inherited Variables:
	* __gameSpace
        * __view
        * __playerTurn
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
	* 	Will End Game If Two Consecutive Passes
	*/
	pass(){
		if(this.__pass){
			this.declareWinner();
			this.__view.showReplayOptions();
                        // todo Travis causing errors. "showReplayOptions" dont seem to be a thing
                        // another similar call is being made from the NetworkGameController.js
                        
			//window.location.href = "winnerPage.html";//TODO: Change to Game Selection
		}else{
                        console.log(this);
                        this.__gameSpace.pass();
			this.__pass = true;
		}
	}

	resign(){
		this.__gameSpace.__gameOver = true;
		console.log("unimplemented method call: RESIGN"); // todo
	}

	end(){
		console.log("unimplemented method call"); // todo
	}

    declareWinner () {
        var scores = this.__gameSpace.getScores();

        var displayPackage = {
            p1Username: 'Black',
            p2Username: 'White',
            p1Score: scores.p1Score,
            p2Score: scores.p2Score,
            winnner: null
        };

        displayPackage.winner = scores.winner === 1 ? 'black' : 'white';

        showWinnerNotification(displayPackage);
    }

}

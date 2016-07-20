'use strict'

class AIGameController extends GameController {

	/* Inherited Variables:
	* __gameSpace, __view, and __playerTurn
	* See GameController for details
	*
	* List of Variables
	* __networkAdapter		Adapter that handles all network communication.
	*
	*/

	constructor(){
		super();
		this.__networkAdapter = new NetworkAdapter();
	}

	placeToken(player, x, y){

		var _this = this;

		var moveAccepted = this.__gameSpace.placeToken(this.__playerTurn, x, y);

		if (moveAccepted){

			//  request server for AI move
			this.__networkAdapter.getAIMove(this.__gameSpace.size, this.__gameSpace.getGrid(), this.__gameSpace.getLastMove(), function(res){

				var aiMove = JSON.parse(res);

				if(aiMove.pass){
					// AI passed
					this.__pass = true;
					alert("The AI passed");
				} else {
					var aiValid = _this.__gameSpace.placeToken(aiMove.c, aiMove.y, aiMove.x); // temporary fix: x=y and y=x
					if (!aiValid){
						// AI's move was not accepted by the placeToken() method
						console.log("AI made an invalid move");
					}
				}

				// Draw the AI made move
				_this.__view.draw();
			});

		} else {
			alert("Invalid Move!");
		}
	}

	pass(){
		var _this = this;
		if(this.__pass){
			this.declareWinner();
			window.location.href = "winnerPage.html";
		}else{
			this.__gameSpace.pass();
			this.__networkAdapter.getAIMove(this.__gameSpace.size, this.__gameSpace.getGrid(), this.__gameSpace.getLastMove(), function(res){

				var aiMove = JSON.parse(res);
				console.log(aiMove);

				if(aiMove.pass){
					_this.declareWinner();
					_this.__view.changeButtons(); // todo throwing errors in the console
				} else {
					var aiValid = _this.__gameSpace.placeToken(aiMove.c, aiMove.y, aiMove.x); // temporary fix: x=y and y=x
					if (!aiValid){
						// AI's move was not accepted by the placeToken() method
						log("AI made an invalid move");
					}
				}

				// Draw the AI made move
				_this.__view.draw();
			});
		};
	}

	resign(){
		console.log("unimplemented method call");
	}

	end(){
		console.log("unimplemented method call");
	}

    declareWinner () {
        var scores = this.__gameSpace.getScores();

        var displayPackage = {
            p1Username: 'Player',
            p2Username: 'Computer',
            p1Score: scores.p1Score,
            p2Score: scores.p2Score,
            winnner: null
        };

        displayPackage.winner = scores.winner === 1 ? 'Player' : 'Computer';

        showWinnerNotification(displayPackage);
    }

}

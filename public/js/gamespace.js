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
    }

    //  getBoard
    //      Returns the GameBoard object
    getBoard () {
        return this.board;
    }

    //  evaluateMove
    //
    //      This function evalutates the change in the board made by placing
    //      a token, including destroying armies.  Used to check if a move
    //      reverts the board, and to update the gameboard.
    //
    //      Params:
    //          player - the player placing a token
    //          x - the x-coordinate where the player is placing a token
    //          y - the y-coordinate
    //          gameboard - a gameboard. If omitted, uses current state of this
    //              gamespace's board
    __evaluateMove (player, x, y, gameboard) {

        var thisBoard = gameboard || this.board;


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

        if (this.checkLegal(player, x, y)) {
            console.log('Player ' + player + ' placing token at (' + x + ',' + y +')');
            this.history.push(this.board);
            this.board = this.board.clone();
            this.board.set(player, x, y);
            this.board.print();
            return true;
        }
        return false;
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

    //  boardReverted
    //      Params:
    //          player - the player placing a token
    //          x - the x-coordinate where the player is trying to place a token
    //          y - the y-coordinate
    //      Returns:
    //          True if this move would revert the board to the same state it
    //              was last turn
    //          False otherwise
    __boardReverted (player, x, y) {
        if (this.history.length === 0) {
            return false;
        }

        var tempBoard = this.board.clone();
        tempBoard.set(player, x, y);

        return GameBoard.equal(tempBoard, this.history[this.history.length - 1])
    }

    //  countSpaceLiberties
    //      Params:
    //          player - the player placing a token
    //          x - the x-coordinate where the player is trying to place a token
    //          y - the y-coordinate
    //      Returns the number of liberties the space has, including friendly
    //          armies
    __countSpaceLiberties (player, x, y) {

        var liberties = 0
        var opponent = this.__opposingPlayer(player);

        if (x - 1 > -1 && this.board.get(x - 1, y) != opponent) {
            liberties += 1;
        }
        if (y - 1 > -1 && this.board.get(x, y - 1) != opponent) {
            liberties += 1;
        }
        if (x + 1 < this.size && this.board.get(x + 1, y) != opponent) {
            liberties += 1;
        }
        if (y + 1 < this.size && this.board.get(x, y + 1) != opponent) {
            liberties += 1;
        }

        return liberties;
    }

    //  countArmyLibertiesDFS
    //
    //      This is a recursive DFS algorithm that counts the liberties of an
    //      army.
    //
    //      Params:
    //          player - 1 or 2, the player trying to play their turn
    //          x - the x-coordinate where the player is trying to place a token
    //          y - the y-coordinate
    //          visited - a GameBoard object where visited spaces are marked 1
    //      Return the number of liberties the army starting at (x,y) has
    __countArmyLibertiesDFS (player, x, y, visited) {

        console.log('-----------------------');
        console.log('(' + x + ',' + y + ')');
        console.log('(Visited: ' + visited.get(x, y));
        console.log('Belongs To:' + this.board.get(x, y));

        var liberties = 0;

        //If
        //  1) This space has been visited
        //  2) This space belongs to the current player
        //Then don't count its liberties towards the total
        if (visited.get(x, y) === 1 || this.board.get(x, y) === player) {
            return 0;
        }

        //Mark as Visited
        visited.set(x, y, 1);

        //If This space is unoccupied
        //Then Return 1 Liberty
        if (this.board.get(x, y) === 0) {
            return 1;
        }

        //If adjacent square is not off the board
        //Then check who it belongs to and add their liberties to the total
        if (x - 1 > -1) {
            liberties += this.__countArmyLibertiesDFS(player, x-1, y, visited);
        }
        if (y - 1 > -1) {
            liberties += this.__countArmyLibertiesDFS(player, x, y-1, visited);
        }
        if (x + 1 < this.size) {
            liberties += this.__countArmyLibertiesDFS(player, x+1, y, visited);
        }
        if (y + 1 < this.size) {
            liberties += this.__countArmyLibertiesDFS(player, x+1, y, visited);
        }

        //Return the Liberties of all adjacent, non-visted spaces
        return liberties;
    }

    //  countArmyLiberties
    //      Params:
    //          player - 1 or 2, the player trying to play their turn
    //          x - the x-coordinate where the player is trying to place a token
    //          y - the y-coordinate
    //      Return the TOTAL number of liberties the army including (x,y) has
    __countArmyLiberties (player, x, y) {
        var visited = new GameBoard(this.size);

        return this.__countArmyLibertiesDFS(player, x, y, visited);
    }

    //  areArmiesDestroyed
    //
    //      This algorithm checks if an adjacent army has been destroyed by
    //      counting its liberties. If it only has one remaining liberty, then
    //      it is THIS space, and placing this army will destroy it.
    //
    //      Params:
    //          player - 1 or 2, the player trying to play their turn
    //          x - the x-coordinate where the player is trying to place a token
    //          y - the y-coordinate
    //      Returns:
    //          True if this move destroys one of the adjacent armies
    //          False otherwise
    __areArmiesDestroyed (player, x, y) {

        var destroyed = false;
        var count;
        var opponent = this.__opposingPlayer(player);

        if (x - 1 > -1 && this.board.get(x-1, y) === opponent) {
            count = this.__countArmyLiberties(player, x-1, y);
            console.log('(' + (x-1) + ',' + y + ')' + ' army liberties:' + count);
            if (count === 1) {
                return true;
            }
        }
        if (y - 1 > -1 && this.board.get(x, y-1) === opponent) {
            count = this.__countArmyLiberties(player, x, y-1);
            console.log('(' + x + ',' + (y-1) + ')' + ' army liberties:' + count);
            if (count === 1) {
                return true;
            };
        }
        if (x + 1 < this.size && this.board.get(x+1, y) === opponent) {
            count = this.__countArmyLiberties(player, x+1, y);
            console.log('(' + (x+1) + ',' + y + ')' + ' army liberties:' + count);
            if (count === 1) {
                return true;
            };
        }
        if (y + 1 < this.size && this.board.get(x, y+1) === opponent) {
            count = this.__countArmyLiberties(player, x, y+1);
            console.log('(' + x + ',' + (y+1) + ')' + ' army liberties:' + count);
            if (count === 1) {
                return true;
            };
        }

        return false;
    }

    //  getArmyCoordsDFS
    //
    //      This is a recursive DFS algorithm that gets the coordinates of each
    //      token in an army, returning them in post-order.
    //
    //      Params:
    //          player - 1 or 2, the player trying to play their turn
    //          x - the x-coordinate where the player is placing a token
    //          y - the y-coordinate
    //          visited - a GameBoard object where visited spaces are marked 1
    //          tokens - an array of objects containing token coordinates
    //      Return a token of this spaces coordinates and validity
    __getArmyCoordsDFS (player, x, y, visited, tokens) {

        console.log('-----------------------');
        console.log('(' + x + ',' + y + ')');
        console.log('(Visited: ' + visited.get(x, y));
        console.log('Belongs To:' + this.board.get(x, y));

        var opponent = this.__opposingPlayer(player);

        var token = {
            invalid: false,
            x: x,
            y: y
        }

        //If this space has been visited
        //Then return token, but mark it as a duplicate of a visited token
        if (visited.get(x, y) === 1) {
            token.invalid = true;
            return token;
        }

        //Mark as Visited
        visited.set(x, y, 1);

        //If
        //  1) this space belongs to the opponent
        //  2) this space is unoccupied
        //Then visit
        if (this.board.get(x, y) === opponent || this.board.get(x, y) === 0) {
            token.invalid = true;
            return token;
        }

        //If adjacent square is not off the board
        //Then check who it belongs to and add their liberties to the total
        if (x-1 > -1) {
            tokens.push(this.__getArmyCoordsDFS (player, x-1 , y, visited, tokens));
        }
        if (y-1 > -1) {
            tokens.push(this.__getArmyCoordsDFS (player, x, y-1, visited, tokens));
        }
        if (x+1 < this.size) {
            tokens.push(this.__getArmyCoordsDFS (player, x+1, y, visited, tokens));
        }
        if (y+1 < this.size) {
            tokens.push(this.__getArmyCoordsDFS (player, x, y+1, visited, tokens));
        }

        //Return the the token
        return token;
    }

    //  getArmyCoords
    //
    //      This is a recursive DFS algorithm that gets the coordinates of each
    //      token in an army, returning them in post-order.
    //
    //      Params:
    //          player - 1 or 2, the player trying to play their turn
    //          x - the x-coordinate where the player is placing a token
    //          y - the y-coordinate
    //      Return an array of objects containing the coordinates of each token
    //          in the army
    __getArmyCoords (player, x, y) {

        var visited = new GameBoard(this.size);
        var tokens = [];

        return __getArmyCoordsDFS(player, x, y, visited, tokens);
    }

    //  isArmyDestroyed
    //
    //      Params:
    //          player - 1 or 2, the player trying to play their turn
    //          x - the x-coordinate of a opponent's token
    //          y - the y-coordinate
    //      Returns:
    //          True if the army is destroyed by this move
    //          False otherwise
    __isArmyDestroyed (player, x, y) {
        if (__countArmyLibertiesDFS (player, x, y, visited) === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    //  destroyArmy
    //
    //      Destroys the army that the token at (x,y) is included in.
    //
    //      Params:
    //          x - the x-coordinate of a token in the army being destroyed
    //          y - the y-coordinate
    __destroyArmy (x, y) {

    }

    //returns true if move is legal, false if illegal
    checkLegal (player, x, y) {

        //If the space is occupied
        if (this.board.get(x, y) !== 0) {
            return false
        }

        //If an adjacent enemy army is destroyed, freeing that space's liberty
        if (this.__areArmiesDestroyed(player, x, y)) {

            //If the move does not revert to the previous turn
            if (this.__boardReverted(player, x, y)) {
                console.log("--invalid move: board reverted");
                return false;
            }

            else {
                console.log('--valid move');
                return true;
            }
        }

        else if (this.__countSpaceLiberties(player, x, y) > 0) {
            console.log('--valid move');
            return true;
        }

        else  {
            console.log("--invalid move: no liberties");
            return false;
        }
    }
}

// Testing Code

var a = new GameSpace(9);
a.getBoard();
a.getBoard().print();
a.placeToken(2,2,5);
a.placeToken(2,4,5);
a.placeToken(2,3,4);
a.placeToken(2,3,6);
a.placeToken(2,4,3);
a.placeToken(2,2,3);

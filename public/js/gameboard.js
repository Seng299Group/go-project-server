'use strict'
/******************
*
*   This class represents the game board as an array of arrays containing:
*           0 - Unoccupied
*       1 - Player 1 Token
*       2 - Player 2 Token
*   It is also used to represent a "visited" matrix of the board for a DFS
*   algorithm used to count liberties and identify armies.  Each space contains
*   either:
*       0 - Not visited
*       1 - Visited
*   EX. Gameboard
*       |-0-|-1-|-2-|-3-|-4-|x
*    -0-| 0 | 0 | 1 | 0 | 0 |
*    -1-| 0 | 0 | 2 | 1 | 2 |
*    -2-| 0 | 0 | 0 | 2 | 1 |
*    -3-| 0 | 0 | 2 | 0 | 2 |
*    -4-| 0 | 0 | 0 | 2 | 0 |
*     y
*     EX. Visited
*        -0-|-1-|-2-|-3-|-4-|x
*    -0-| 0 | 0 | 1 | 0 | 0 |
*    -1-| 0 | 1 | 1 | 1 | 1 |
*    -2-| 0 | 0 | 1 | 0 | 1 |
*    -3-| 0 | 1 | 1 | 0 | 1 |
*    -4-| 0 | 0 | 1 | 1 | 0 |
*     y
*     The above is printed by the .print() method
*
*/

class GameBoard {

    /*
    Attributes:
        board - an array of arrays of size [n][n]
        size - the length of the boards axis
    */

    //  constructor
    //      Params:
    //          size - size of the board
    constructor (size) {

        var i,j;
        var board = [];

        //Initialize each space to 0
        for (i=0; i<size; i++) {

            var row = [];

            for (j=0; j<size; j++) {
                row.push(0);
            }

            board.push(row);
        }

        this.board = board;
        this.size = size;

    }

    //  get
    //      Params
    //          x - x coordinate
    //          y - y coordinate
    //      Returns 0, 1, or 2
    get (x, y) {
        return this.board[y][x];
    }

    // getBoard
    //      Returns The entire board array
    getBoard () {
        return this.board;
    }

    //  get
    //      Params
    //          val - 0, 1, or 2, the p
    //          x - x coordinate
    //          y - y coordinate
    set (val, x, y) {
        this.board[y][x] = val;
    }

    //  clone
    //      Returns a new GameBoard object, identical to this one
    clone () {

        var newBoard = new GameBoard(this.size);

        var i,j;

        for (i=0; i<this.size; i++) {

            for (j=0; j<this.size; j++) {

                newBoard.set(this.get(i, j), i, j);
            }
        }

        return newBoard;
    }

    //  getRowHeader
    //      Returns - String of this board header, the x-axis numbers
    __getRowHeader () {

        var string = "   |";
        var i;

        console.log(this.board);

        this.board.forEach(function (column, index) {
            string += "-" + index + "-|";
        });

        return string;
    }

    //  getRowString
    //      Returns - String of this row of the board, human readable
    __getRowString (row) {

        var string = "-" + row + "-|";
        var i;

        this.board[row].forEach(function (space) {
            string += " " + space + " |";
        });

        return string;
    }

    //  print
    //      Prints the game board to the console in human readable format
    print () {

        var that = this;

        console.log(this.__getRowHeader());
        this.board.forEach(function (row, index, board) {
            console.log(that.__getRowString(index));
        })
    }

    //  equal
    //      Params:
    //          b1, b2 - GameBoard Objects
    //      Returns:
    //          True if the GameBoards are identical
    //          False Otherwise
    static equal(b1, b2) {

        var i,j;

        if (b1.size != b2.size) {
            console.log('b1 and b2 are of different sizes');
            return false;
        }

        for (i=0; i<b1.size; i++) {

            for (j=0; j<b1.size; j++) {

                if (b1.board[i][j] !== b2.board[i][j]) {
                    return false;
                }
            }
        }

        console.log('b1 and b2 are equal');
        return true;
    }
}

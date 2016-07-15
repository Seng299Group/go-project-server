'use strict'

/* List of variables:
*
* __username			- The name of the user. Only set once by the constructor
* __opponent			- The name of the opponent.
* __socketid			- Socket ID
*
* __sentGameRequestTo	- an array of all users that
*							this user sent a game request to.
*
*/

/* List of methods: 
*
* constructor			- for the User object
*
* +----------------------------------------------------------------------------+
* | Getters						| Setters
* +----------------------------------------------------------------------------+
* | 							| sentGameRequestTo
* | getUsername					| 
* | getOpponent					| setOpponent
* | getSocketid					| setSocketid
* +----------------------------------------------------------------------------+
*
*/

class User {
	
	constructor(username){
		this.__username = username;
                this.__opponent = null
		this.__sentGameRequestTo = [];
                this.__socketid = null
                this.__isOnline = true;
                this.__boardSize = 0;
                this.__isInGame = false;
	}
	
	getUsername(){
		return this.__username;
	}
	
	setOpponent(opponent){
		this.__opponent = opponent;
	}
	
	getOpponent(){
		return this.__opponent;
	}
	
	setSocketID(socketid){
		this.__socketid = socketid;
	}
	
	getSocketID(){
		return this.__socketid;
	}
	
	sentGameRequestTo(toUser){
		this.__sentGameRequestTo.push(toUser)
	}
        
        setIsOnline(isOnline){
            this.__isOnline = isOnline;
        }
        
        isOnline(){
            return this.__isOnline;
        }
        
        setBoardSize(size){
            this.__boardSize = size;
        }
        
        getBoardSize(){
            return this.__boardSize;
        }
        
        setIsInGame(isInGame){
            this.__isInGame = true;
        }
        
        getIsInGame(){
            return this.__isInGame;
        }
	
}

module.exports = User;
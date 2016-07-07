'use strict'

class User {
	
	/* List of variables:
	* __username	- The name of the user. Only set once by the constructor
	* __opponent	- The name of the opponent.
	*
	*
	* List of methods: 
	* getUsername
	* getOpponent
	* setOpponent
	* 
	*/
	
	constructor(username){
		this.__username = username;
		this.__opponent = "null"
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
	
}

module.exports = User;
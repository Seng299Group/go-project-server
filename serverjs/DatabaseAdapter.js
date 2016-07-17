
var User = require("./User.js");

/**
 * @param {string} username
 * @param {string} password
 * @returns {boolean} true if username and password is correct
 */
function authenticateUser(username, password) {

    // todo delete
    // for dev purposes
    if (username === password) {
        return true;
    } else {
        return false;
    }

}

/**
 * 
 * @param {string} username
 * @returns {object} user's data from the db (must abide the server side User data structure)
 */
function getUserData(username) {

    // query for user data

    var u = new User(username);

    // todo delete
    // for dev purposes
    return u;
}

/*
 * other functions to query the database as needed
 * /
 
 /*
 * function example(){
 *      ...
 * }
 *  
 */

module.exports = {
    authenticate: authenticateUser,
    getUserData: getUserData // ,
            // example : example
            // ...

};
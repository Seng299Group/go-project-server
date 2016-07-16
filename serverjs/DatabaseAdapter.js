
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
    authenticate: authenticateUser // ,
            // example : example
            // ...

};
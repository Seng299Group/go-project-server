var User = require("./User.js");

//load the mongoose module
var mongoose = require('mongoose');

//connect to database using the DB server URL.
mongoose.connect('mongodb://localhost:27017/my_database_name');

//define Model for User entity. This model represents a collection in the database.
//define the possible schema of User document and data types of each field.
var Userdb = mongoose.model('Userdb', {username: String, password: String});

/**
 *
 * @param {string} username
 * @param {string} password
 * @returns {boolean} true if username and password is correct
 */
function authenticateUser(username, password, fn) {
    Userdb.findOne({username: username, password: password}, function (err, userObj) {
    if (err)
      console.log(err);
    userObj ? fn(true) : fn(false)
  });
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

function register() {
  var username = $("#user-name").val();
  var password = $("#password").val();
  var passwordCheck = $("#password-check").val();
  var security = $("#security-question").val();

  // todo, redo broken register system.
}

//validates username against a regex and ensures it is unique in the database.
function checkUser(username) {
  var re = /^\w+$/;
  if(username.length < 4) {
    $('#user-err').html('Username must be atleast 4 characters long.');
    return false;
  }
  else if(!re.test(username)) {
    $('#user-err').html('Username must contain only letters, numbers and underscores');
      return false;
  }
// ensuring a unique username is choosen must be done server side.
/*
  else if(find_user(username) != false) {
    $('#user-err').html('Sorry, that username is already taken.');
    return false;
  }
*/
  else {
    $('#user-err').html('');
    return true;
  }
}

// validates the password entered against a regex
function checkPass(pass) {
  // atleast 6 characters with atleast 1 letter and 1 number
  var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if(!re.test(pass)) {
      $('#password-check-err').html('Invalid Password, must be atleast 6 characters long with 1 Alphabet and 1 Number');
      return false;
  }
  else {
    $('#password-check-err').html('');
    return true;
  }
}

// confirms the two passwords entered are the same.
function confirmPass(confirm) {
  var password = $('#password').val();

  if(confirm != password) {
    $('#confirm-err').html('Passwords do not match!');
    return false;
  }
  else if(confirm === password) {
    $('#confirm-err').html(' ');
    return true;
  }
}

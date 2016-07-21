var socket = io();

var user;

if (sessionStorage.isGuest === "false") {
    // user logged in using username and password
    // therefore, request user data
    userWL(sessionStorage.username);
}

function userWL(username) {


  (new NetworkAdapter()).userWinLoss(username, onRes);

  function onRes(success, data) {
    username = 'Welcome, ' + username;
    $(".welcome-message").append(username);
    var games =  $(".games-played");
    var wins = $(".wins");
    var losses = $(".losses");
    var winRate = $(".win-rate");

    if(success) {
      console.log('onRes was successful');
      console.log(data);
      var totalGames = (data.wins + data.losses);
      if(totalGames === 0) {
        var winRatePercnt = 0
      }
      else {
        var winRatePercnt = (data.wins/totalGames);
      }

      games.append(totalGames);
      wins.append(data.wins);
      losses.append(data.losses);
      winRate.append(winRatePercnt + '%');

    }
    else {
      console.log('onRes was failed');

      games.append('n/a');
      wins.append('n/a');
      losses.append('n/a');
      winRate.append('n/a');
    }
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
    $('#confirm-err').html('');
    return true;
  }
}





function routeGameSelect() {
  window.location.href = "/gameSelect.html";
}

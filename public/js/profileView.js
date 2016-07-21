var socket = io();

var user;

if (sessionStorage.isGuest === "false") {
    // user logged in using username and password
    // therefore, request user data
    userdataForUsername(sessionStorage.username);
}









function routeGameSelect() {
  window.location.href = "/gameSelect.html";
}

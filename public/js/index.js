delete(sessionStorage.sessionID);
delete(sessionStorage.gameMode);

function login() {
    var username = $("#user-name").val();
    var password = $("#password").val();
    (new NetworkAdapter()).login(username, password);
}
//delete(sessionStorage.sessionID);
//delete(sessionStorage.gameMode);

function login() {

    var username = $("#user-name").val();
    var password = $("#password").val();
    // jquery's  .val() sanitizes inputs

    if (username === "" || password === "") {
        alert("Please enter your username and password");
    } else {

        (new NetworkAdapter()).login(username, password, onRes);

        /**
         * @param {boolean} success
         * @param {string} socketid (should be null if success is false)
         */
        function onRes(success, socketid) {
            if (success) {
                sessionStorage.isGuest = false;
                sessionStorage.username = username;
                sessionStorage.sessionID = socketid;
                window.location.href = "/gameSelect.html";
            } else {
                // Login failed
                alert("Incorrect username or password");
            }
        }

    }

}

function quickplay() {
    sessionStorage.isGuest = true;
    window.location.href = "/gameSelect.html";
}
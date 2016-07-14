// Guest log in

// call server

if (sessionStorage.sessionID === undefined) { // new user

    var socket = io();
    socket.emit('guestLogin', 'guest login');

    socket.on('guestLogin', function (data) {
        console.log(data);
        sessionStorage.sessionID = data.__socketid;
    });

} else { // 
    console.log("returning user " + sessionStorage.sessionID); // todo handle returning user
}

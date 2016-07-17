
class NotificationBuilder {

    /**
     * This method returns a notification (DOM object - div)
     * 
     * @param {type} title - Title of the notification
     * @param {type} body - Body of the notification
     * @param {type} buttons - array of buttons made with the makeNotificationButton() function
     * @returns {DOM object} - Div element: notification
     */
    makeNotification(title, bodyText, buttons) {
        var notification = $(document.createElement('div'));

        var headline = $(document.createElement('h1'));
        headline.html(title);
        notification.append(headline);

        var body = $(document.createElement('p'));
        body.html(bodyText);
        notification.append(body);

        var buttonWrapper = $(document.createElement('div'));
        buttonWrapper.css("text-align","center");
        if (buttons.length == 1) {
            buttonWrapper.append(buttons);
        } else {
            for (var b in buttons) {
                buttonWrapper.append(buttons[b]);
            }
        }
       
        notification.append(buttonWrapper);

        return notification;
    }

    /**
     * This method returns a notification button (DOM object - div)
     * 
     * @param {string} text - Text inside the button
     * @param {function} onClick - executes when the button is clicked
     * @returns {DOM object - div}
     */
    makeNotificationButton(text, onClick) {
        var b = $(document.createElement('div'));
        b.html(text);
        b.css("cursor", "pointer");
        b.click(onClick);
        return b;
    }
    
    
    
    
    /************************** Premade Notifications *************************/
    getSessionExpiredNotification() {
        var nf;
        var title = "Session Expired";
        var msg = "Please return to the homepage";
        var button = nfBuilder.makeNotificationButton("Return to Homepage", function () {
//            delete(sessionStorage.sessionID);
            sessionStorage.clear();
            window.location.href = "/";
        });
        button.addClass("sessionExpiredNotification-button");

        nf = nfBuilder.makeNotification(title, msg, button); // todo remove nfBuilder and replace with this
        nf.addClass("sessionExpiredNotification");

        return nf;
    }
    
    getInGameNotification(){
        var nf ;
        var title = "You are currently in a game";
        var msg = "Please return to the game";
        var button = this.makeNotificationButton("Return to the game", function () {
            window.location.href = "/GameView.html";
        });
        button.addClass("leftGameInProgressNotification-button");

        nf = this.makeNotification(title, msg, button).attr("class", "boardSizeNotification");
        nf.addClass("leftGameInProgressNotification");
        
        return nf;
    }
    
}
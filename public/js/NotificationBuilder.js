
/**
 * CSS independent notification builder.
 * CSS can be added using JavaScript or jquery.
 * See example for user.
 * 
 * 
 * 
 * Example:
 * 
 * // Create the builder object
 * var nfBuilder = new NotificationBuilder();
 * 
 * // Create a button
 * var myButton = nfBuilder.makeNotificationButton("button text", function () {  }); //takes onClick function
 * 
 * // Create the notification
 * var myNotification = nfBuilder.makeNotification("title", "body text", myButton);
 * 
 * // Add CSS
 * myNotification.attr("class", "myClass"); // jquery
 * 
 * // Add to the view
 * $("body").append(myNotification);
 * 
 */

class NotificationBuilder {

    /**
     * This method returns a notification (DOM object - div)
     * 
     * @param {string} title - Title of the notification
     * @param {string} bodyText - Body of the notification
     * @param {div} buttons - one or an array of buttons made with the makeNotificationButton() function
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
     * @returns {DOM object} div
     */
    makeNotificationButton(text, onClick) {
        var b = $(document.createElement('div'));
        b.html(text);
        b.css("cursor", "pointer");
        b.click(onClick);
        return b;
    }
    
    
    
    
    
    /************************* Pre-made Notifications *************************/
    getSessionExpiredNotification() {
        var nf;
        var title = "Session Expired";
        var msg = "Please return to the homepage";
        var button = nfBuilder.makeNotificationButton("Return to Homepage", function () {
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
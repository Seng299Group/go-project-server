
class NotificationBuilder {

    /**
     * This method returns a notification (DOM object - div)
     * 
     * @param {type} title - Title of the notification
     * @param {type} body - Body of the notification
     * @param {type} buttons - array of buttons made with the makeNotificationButton() function
     * @returns {DOM object} - Div element: notification
     */
    makeNotification(title, body, buttons) {
        var notification = $(document.createElement('div'));

        var headline = $(document.createElement('h1'));
        headline.html(title);
        notification.append(headline);

        var headline = $(document.createElement('p'));
        headline.html(body);
        notification.append(headline);

        for (var b in buttons) {
            notification.append(buttons[b]);
        }

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
        b.click(onClick);
        return b;
    }

}
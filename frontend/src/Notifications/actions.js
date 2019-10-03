export const addNotification = (title, text, type, timeout, isModal=false) => 
    ({ type: 'NOTIFICATION_ADDED', notification: {title, text, type, timeout, isModal} });

export const onHTML5Blocked = () => {
    console.log('******* HTML5 Blocked');
    return { type: 'NOTIFICATIONS_HTML5_BLOCKED' };
}

export const Notifications = {
    add: addNotification,
    remove: notification => ({ type: 'NOTIFICATION_REMOVED', notification }),
    html5Blocked: onHTML5Blocked,
};


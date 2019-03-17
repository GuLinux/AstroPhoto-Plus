export const addNotification = (title, text, type, timeout, isModal=false) => 
    ({ type: 'NOTIFICATION_ADDED', notification: {title, text, type, timeout, isModal} });

export const Notifications = {
    add: addNotification,
    remove: notification => ({ type: 'NOTIFICATION_REMOVED', notification }),
    html5Blocked: () => ({ type: 'NOTIFICATIONS_HTML5_BLOCKED'}),
};


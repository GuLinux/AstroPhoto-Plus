let nextNotificationId = 0;

const notifications = (state = [], action) => {
    switch(action.type) {
        case 'NOTIFICATION_ADDED':
            return [...state, {...action.notification, id: nextNotificationId++}];
        case 'NOTIFICATION_REMOVED':
            return state.filter(notification => notification.id !== action.notification.id);
        default:
            return state;
    }
}

export default notifications;


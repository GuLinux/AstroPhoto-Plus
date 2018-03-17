export const Notifications = {
    add: (title, text, type, timeout) => {
        return { type: 'NOTIFICATION_ADDED', notification: {title, text, type, timeout} }
    },
    remove: (notification) => { 
        return { type: 'NOTIFICATION_REMOVED', notification };
    }
};

export default Notifications;

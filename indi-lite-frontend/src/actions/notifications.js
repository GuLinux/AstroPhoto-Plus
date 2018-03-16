export const Notifications = {
    add: (title, text, type) => {
        return { type: 'NOTIFICATION_ADDED', notification: {title, text, type} }
    },
    remove: (notification) => { 
        return { type: 'NOTIFICATION_REMOVED', notification };
    }
};

export default Notifications;

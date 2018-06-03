export const Notifications = {
    add: (title, text, type, timeout, isModal=false) => {
        return { type: 'NOTIFICATION_ADDED', notification: {title, text, type, timeout, isModal} }
    },
    remove: (notification) => { 
        return { type: 'NOTIFICATION_REMOVED', notification };
    }
};

export default Notifications;

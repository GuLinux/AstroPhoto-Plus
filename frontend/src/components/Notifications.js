import React from 'react';
import { Alert } from 'react-bootstrap';

const notificationStyles = {
    error: 'danger',
    info: 'info',
    warning: 'warning',
    success: 'success',
};

const setAutoclose = (notification, onClosed) => {
    if(notification.timeout) {
        setTimeout( () => onClosed(notification), notification.timeout );
    }
}

const Notificatons = ({notifications, onClosed}) => (
    <div className="notifications-container">
        {notifications.map( (notification, index) => {
            setAutoclose(notification, onClosed);
            return (
            <Alert key={index} bsStyle={notificationStyles[notification.type]} onDismiss={() => onClosed(notification)}>
                <h4>{notification.title}</h4>
                {notification.text}
            </Alert>
        )}
        )}
    </div>
)

export default Notificatons

import React from 'react';
import { Alert } from 'react-bootstrap';

const notificationStyles = {
    error: 'danger',
    info: 'info',
    warning: 'warning',
    success: 'success',
};

const Notificatons = ({notifications, onClosed}) => (
    <div>
        {notifications.map( (notification, index) => (
            <Alert bsStyle={notificationStyles[notification.type]} onDismiss={() => onClosed(notification)}>
                <h4>{notification.title}</h4>
                {notification.text}
            </Alert>
        ))}
    </div>
)

export default Notificatons

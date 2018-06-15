import React from 'react';
import { Message, Icon} from 'semantic-ui-react';

const icons = {
    error: 'times circle',
    info: 'info circle',
    warning: 'warning circle',
    success: 'check circle',
};


const setAutoclose = (notification, onClosed) => {
    if(notification.timeout) {
        setTimeout( () => onClosed(notification), notification.timeout );
    }
}

const AlertNotification = ({notification, onDismiss}) => (
    <Message icon {...{[notification.type]: true}} onDismiss={() => onDismiss() }>
        <Icon name={icons[notification.type]} />
        <Message.Content>
            <Message.Header>{notification.title}</Message.Header>
            {
                Array.isArray(notification.text) ? notification.text.map((t, i) => <p key={i}>{t}</p>) : <p>notification.text</p>
            }
        </Message.Content>
    </Message>
)


const Notificatons = ({notifications, onClosed}) => (
    <div className="notifications-container">
        {notifications.map( (notification, index) => {
            setAutoclose(notification, onClosed);
            return <AlertNotification key={index} notification={notification} onDismiss={() => onClosed(notification)} />
        }
        )}
    </div>
)

export default Notificatons

import React from 'react';
import { Message, Icon} from 'semantic-ui-react';
import HTML5Notification from 'react-web-notification';

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
    <Message onClick={onDismiss} icon {...{[notification.type]: true}}>
        <Icon name={icons[notification.type]} />
        <Message.Content>
            <Message.Header>{notification.title}</Message.Header>
            {
                Array.isArray(notification.text) ? notification.text.map((t, i) => <p key={i}>{t}</p>) : <p>{notification.text}</p>
            }
        </Message.Content>
    </Message>
)

const html5NotificationOptions = notification => ({
    icon: '/icon-256.png',
    body: Array.isArray(notification.text) ? notification.text.join('\n') : notification.text,
    tag: `app-notification-{notification.id}`,
    requireInteraction: !notification.timeout,
});

const HTML5NotificationComponent = ({notification, onDismiss}) => (
    <HTML5Notification
        title={notification.title}
        timeout={notification.timeout || 9999}
        options={html5NotificationOptions(notification)}
        onClick={onDismiss}
        onClosed={onDismiss}
    />
);


export class Notifications extends React.PureComponent {

    onClosed = notification => () => this.props.onClosed(notification);

    renderNotification = (notification, index) => {
        setAutoclose(notification, this.onClosed(notification));
        let NotificationComponent = AlertNotification;
        if(this.props.html5Enabled) {
            NotificationComponent = HTML5NotificationComponent;
        }
        return <NotificationComponent key={index} notification={notification} onDismiss={this.onClosed(notification)} />
    }

    render = () => {
        const {notifications } = this.props;
        return (
            <div className="notifications-container">
                <HTML5Notification ignore onPermissionDenied={this.props.onHTML5Blocked} title='Request Notification Permission' />
                {notifications.map(this.renderNotification)}
            </div>
        )
    }
}


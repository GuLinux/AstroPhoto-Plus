import React from 'react';
import { Message, Icon} from 'semantic-ui-react';
import HTML5Notification from 'react-web-notification';
import queryString from 'query-string';

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
    tag: `ap+_${notification.type}_${notification.id}`,
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

    constructor(props) {
        super(props);
        this.state = {};
        if(! this.setupDesktopNotifications()) {
            this.requestPermission();
        }
    }

    setupDesktopNotifications = () => {
        const { desktopClientSessionId } = queryString.parse(window.location.search);
        if(!desktopClientSessionId) {
            return false;
        }
        this.props.setDesktopNotificationsUuid(desktopClientSessionId);
        return true;
    }

    requestPermission = async () => {
        const permission = await Notification.requestPermission();
        this.setState({ permission });
    }

    onClosed = notification => () => this.props.removeNotification(notification);

    renderNotification = (notification, index) => {
        setAutoclose(notification, this.onClosed(notification));
        let NotificationComponent = AlertNotification;
        if(this.state.permission === 'granted') {
            NotificationComponent = HTML5NotificationComponent;
        }
        return <NotificationComponent key={index} notification={notification} onDismiss={this.onClosed(notification)} />
    }

    render = () => {
        if(this.props.desktopNotificationsUuid) {
            return null;
        }
        return (
            <div className="notifications-container">
                {this.props.notifications.map(this.renderNotification)}
            </div>
        )
    }
}


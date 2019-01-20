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


export class Notifications extends React.PureComponent {

    onClosed = notification => () => this.props.onClosed(notification);

    renderNotification = (notification, index) => {
        setAutoclose(notification, this.onClosed(notification));
        return <AlertNotification key={index} notification={notification} onDismiss={this.onClosed(notification)} />
    }

    render = () => {
        const {notifications } = this.props;
        return (
            <div className="notifications-container">
                {notifications.map(this.renderNotification)}
            </div>
        )
    }
}


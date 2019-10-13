import { connect } from 'react-redux';
import { Notifications } from './Notifications';
import { removeNotification, setDesktopNotificationsUuid } from './actions';
import { notificationsSelector } from './selectors';

const mapDispatchToProps = {
    removeNotification,
    setDesktopNotificationsUuid,
}

export const NotificationsContainer = connect(notificationsSelector, mapDispatchToProps)(Notifications)


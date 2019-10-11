import { connect } from 'react-redux';
import { Notifications } from './Notifications';
import Actions from '../actions';
import { notificationsSelector } from './selectors';

const mapDispatchToProps = {
    onClosed: Actions.Notifications.remove,
}

export const NotificationsContainer = connect(notificationsSelector, mapDispatchToProps)(Notifications)


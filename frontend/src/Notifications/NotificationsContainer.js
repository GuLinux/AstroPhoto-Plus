import { connect } from 'react-redux'
import { Notifications } from './Notifications'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => {
  return {
    notifications: state.notifications
  }
}

const mapDispatchToProps = {
    onClosed: Actions.Notifications.remove,
}

const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications)

export default NotificationsContainer


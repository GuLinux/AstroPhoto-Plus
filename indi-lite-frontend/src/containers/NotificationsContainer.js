import { connect } from 'react-redux'
import Notifications from '../components/Notifications'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => {
  return {
    notifications: state.notifications
  }
}

const mapDispatchToProps = dispatch => {
    return {
        onClosed: notification => dispatch(Actions.Notifications.remove(notification))
    }
}

const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications)

export default NotificationsContainer


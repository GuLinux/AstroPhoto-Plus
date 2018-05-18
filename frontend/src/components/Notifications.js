import React from 'react';
import { Alert, Modal, Button} from 'react-bootstrap';

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

const AlertNotification = ({notification, onDismiss}) => (
    <Alert bsStyle={notificationStyles[notification.type]} onDismiss={() => onDismiss() }>
        <h4>{notification.title}</h4>
        {notification.text}
    </Alert>
)

const ModalNotification = ({notification, onDismiss}) => (
  <Modal.Dialog>
    <Modal.Header>
      <Modal.Title>{notification.title}</Modal.Title>
    </Modal.Header>

    <Modal.Body>{notification.text}</Modal.Body>

    <Modal.Footer>
      <Button>Close</Button>
    </Modal.Footer>
  </Modal.Dialog>
)


const Notificatons = ({notifications, onClosed}) => (
    <div className="notifications-container">
        {notifications.map( (notification, index) => {
            const NotificationTag = notification.isModal ? ModalNotification : AlertNotification
            setAutoclose(notification, onClosed);
            return <NotificationTag notification={notification} onDismiss={() => onClosed(notification)} />
        }
        )}
    </div>
)

export default Notificatons

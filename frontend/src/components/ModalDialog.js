import React from 'react'
import {Modal} from 'react-bootstrap';

class ModalDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let children = React.Children.map(this.props.children, child => React.cloneElement(child, { closeModal: this.props.close}));
        return (
            <Modal show={this.props.visible} keyboard={true}>
                {children}
            </Modal>
        )
    }
}
export default ModalDialog

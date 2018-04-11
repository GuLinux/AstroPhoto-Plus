import React from 'react'
import {Button, Modal } from 'react-bootstrap';

export const ModalDialog = ({visible, close, modalProps, children}) => {
    children = React.Children.map(children, child => React.cloneElement(child, { closeModal: close, modalProps: modalProps}));
    return (
        <Modal show={visible} keyboard={true}>
            {children}
        </Modal>
    )
}


export const ShowModalDialogButton = (props) => <Button {...props}>{props.text}</Button>

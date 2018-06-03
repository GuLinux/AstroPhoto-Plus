import React from 'react'
import { Modal } from 'react-bootstrap';

export const ModalDialog = ({visible, children}) => (
    <Modal show={visible} keyboard={true}>
        {children}
    </Modal>
)


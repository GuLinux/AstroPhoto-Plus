import React from 'react'
import {Button, Modal } from 'react-bootstrap';

export const ModalDialog = ({visible, children}) => (
    <Modal show={visible} keyboard={true}>
        {children}
    </Modal>
)


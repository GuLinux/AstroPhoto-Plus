import React from 'react'
import { Modal } from 'semantic-ui-react';

export const ModalDialog = ({visible, children}) => (
    <Modal open={visible}>
        {children}
    </Modal>
)

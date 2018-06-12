import React from 'react'
import { Modal, Button, Menu } from 'semantic-ui-react';

export const ModalDialog = ({visible, children, ...rest }) => (
    <Modal open={visible} {...rest}>
        {children}
    </Modal>
)

ModalDialog.Button = Button;
ModalDialog.MenuItem = Menu.Item;

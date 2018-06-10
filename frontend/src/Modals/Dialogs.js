import React from 'react'
import { Modal } from 'semantic-ui-react'
import ModalContainer from './ModalContainer'

export const Dialog = ({name, title, children}) => (
    <ModalContainer name={name}>
        <Modal.Header>{title}</Modal.Header>
        {children}
    </ModalContainer>
)
Dialog.Description = Modal.Description;
Dialog.Content = Modal.Content;
Dialog.Actions = Modal.Actions;
Dialog.Button = ModalContainer.Button;
Dialog.MenuItem = ModalContainer.MenuItem;


export const QuestionDialog = ({name, title, buttons, children}) => (
    <Dialog name={name} title={title}>
        <Dialog.Content>{children}</Dialog.Content>
        <Dialog.Actions>
            { buttons.map( (button, index) => (
                <ModalContainer.Button.Close
                    key={index}
                    modal={name}
                    beforeToggle={button.beforeClose}
                    afterToggle={button.afterClose}
                    primary={button.primary}
                    size={button.size}
                >{button.text}</ModalContainer.Button.Close>
            )
        )}
        </Dialog.Actions>
    </Dialog>
)

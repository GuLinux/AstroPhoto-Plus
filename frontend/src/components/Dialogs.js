import React from 'react'
import { Modal } from 'react-bootstrap'
import ModalContainer from '../containers/ModalContainer'

export const Dialog = ({name, title, children}) => (
    <ModalContainer name={name}>
        <Modal.Header><Modal.Title>{title}</Modal.Title></Modal.Header>
        {children}
    </ModalContainer>
)

Dialog.Body = Modal.Body;
Dialog.Footer = Modal.Footer;
Dialog.Button = ModalContainer.Button

Dialog.MenuItem = ModalContainer.MenuItem

export const QuestionDialog = ({name, title, buttons, children}) => (
    <Dialog name={name} title={title}>
        <Dialog.Body>{children}</Dialog.Body>
        <Dialog.Footer>
            { buttons.map( (button, index) => (
                <ModalContainer.Button.Close key={index} modal={name} beforeToggle={button.beforeClose} afterToggle={button.afterClose} bsStyle={button.bsStyle} bsSize={button.bsSize}>{button.text}</ModalContainer.Button.Close>
            )
        )}
        </Dialog.Footer>
    </Dialog>
)

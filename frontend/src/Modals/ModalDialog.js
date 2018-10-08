import React from 'react'
import { Modal, Button } from 'semantic-ui-react';

const ModalDialogContext = React.createContext();

const ModalDialogCloseButton = (props) => (
    <ModalDialogContext.Consumer>{
        ({close}) => {
            const onClick = () => {
                close();
                props.onClose && props.onClose();
            }
            return <Button {...props} onClick={onClick} />
        }
    }</ModalDialogContext.Consumer>
)

export class ModalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: !!props.open };
    }

    setOpen = (open) => this.setState({...this.state, open});
    open = () => this.setOpen(true);
    close = () => this.setOpen(false);
    toggle = () => this.setOpen(!this.state.open);


    render = () => {
        const {open: _, trigger, triggerAction = 'onClick', children, ...rest} = this.props;
        return (
            <React.Fragment>
                { React.cloneElement(trigger, { [triggerAction]: this.open }) }
                    <Modal open={this.state.open} {...rest}>
                        <ModalDialogContext.Provider value={{close: this.close}}>
                            {children}
                        </ModalDialogContext.Provider>
                    </Modal>

            </React.Fragment>
        )
    }
}

ModalDialog.CloseButton = ModalDialogCloseButton;

export const ConfirmDialog = ({confirmButton, cancelButton, header, content, onCancel=null, onConfirm=null, ...rest}) => (
    <ModalDialog {...rest} >
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>{content}</Modal.Content>
        <Modal.Actions>
            <ModalDialog.CloseButton onClose={() => onCancel && onCancel()} content={cancelButton} />
            <ModalDialog.CloseButton onClose={() => onConfirm && onConfirm()} primary content={confirmButton} />
        </Modal.Actions>
    </ModalDialog>
)




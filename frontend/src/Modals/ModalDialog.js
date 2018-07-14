import React from 'react'
import { Modal, Button, Confirm } from 'semantic-ui-react';

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

export class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: !!props.open };
    }

    setOpen = (open) => this.setState({...this.state, open});
    open = () => this.setOpen(true);
    close = () => this.setOpen(false);
    toggle = () => this.setOpen(!this.state.open);

    onConfirm = () => {
        this.close();
        this.props.onConfirm && this.props.onConfirm()
    }

    onCancel = () => {
        this.close();
        this.props.onCancel && this.props.onCancel()
    }

    render = () => {
        const {open: _, trigger, triggerAction = 'onClick', ...rest} = this.props;

        return (
            <React.Fragment>
                { React.cloneElement(trigger, { [triggerAction]: this.open }) }
                <Confirm open={this.state.open} onConfirm={this.onConfirm} onCancel={this.onCancel} {...rest} />
            </React.Fragment>
        )
    }
}




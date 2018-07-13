import React from 'react'
import { Modal, Button, Menu, Confirm } from 'semantic-ui-react';

const ModalDialogCloseButton = (props) => <Button {...props} />

const ModalDialogActions = ({close, children, ...rest}) => {
    children = React.Children.map(children, c => {
        return c && c.type && c.type.name === 'ModalDialogCloseButton' ? React.cloneElement(c, {
            onClick: () => {
                close();
                c.props.onClose && c.props.onClose();
            }
        }) : c;
    });
    
    return (
        <Modal.Actions {...rest}>
            {children}
        </Modal.Actions>
    );
}

ModalDialogActions.CloseButton = ModalDialogCloseButton;

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
        let {open: _, trigger, triggerAction = 'onClick', children, ...rest} = this.props;
        children = React.Children.map(children, c => {
            return c && c.type && c.type.name === 'ModalDialogActions' ? React.cloneElement(c, { close: this.close }) : c;
        });

        return (
            <React.Fragment>
                { React.cloneElement(trigger, { [triggerAction]: this.open }) }
                <Modal open={this.state.open} {...rest}>
                    {children}
                </Modal>
            </React.Fragment>
        )
    }
}

ModalDialog.Actions = ModalDialogActions;

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

ModalDialog.Button = Button;
ModalDialog.MenuItem = Menu.Item;

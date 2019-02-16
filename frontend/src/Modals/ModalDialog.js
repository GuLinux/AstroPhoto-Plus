import React from 'react'
import { Divider, Form, Modal, Button } from 'semantic-ui-react';
import { get } from 'lodash';

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

    componentDidUpdate = (prevProps, prevState) => {
        if(this.state.open !== prevState.open) {
            this.state.open && this.props.onModalOpened && this.props.onModalOpened();
            !this.state.open && this.props.onModalClosed && this.props.onModalClosed();
        }
    }

    onClose = e => {
        if(e.type === 'keydown' && e.key === 'Escape' && get(this.props, 'closeOnEscape', true)) {
            this.close();
        }
    }


    render = () => {
        const {open, trigger, onModalOpened, onModalClosed, triggerAction = 'onClick', children, closeOnEscape, ...rest} = this.props;
        return (
            <React.Fragment>
                { React.cloneElement(trigger, { [triggerAction]: this.open }) }
                    <Modal onClose={this.onClose} open={this.state.open} {...rest}>
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
    onCancel = () => this.props.onCancel && this.props.onCancel();
    onConfirm = () => this.props.onConfirm && this.props.onConfirm();
    render = () => {
        const { confirmButton, cancelButton, header, content, onCancel, onConfirm, ...rest } = this.props;
        return (
            <ModalDialog {...rest} >
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content>{content}</Modal.Content>
                <Modal.Actions>
                    <ModalDialog.CloseButton onClose={this.onCancel} content={cancelButton} />
                    <ModalDialog.CloseButton onClose={this.onConfirm} primary content={confirmButton} />
                </Modal.Actions>
            </ModalDialog>
        );
    }
}

export class ConfirmFlagsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    initialState = () => ({ flags: this.props.flags.reduce( (acc, cur) => ({...acc, [cur.name]: cur.defaultChecked}), {} ) });

    setFlag = (name, value) => this.setState({...this.state, flags: {...this.state.flags, [name]: value} });

    onOpen = () => this.props.resetState && this.setState(this.initialState());


    modalProps = () => {
        const {resetState, flags, ...modalProps } = this.props;
        return modalProps;
    }

    render = () => (

        <ConfirmDialog {...this.modalProps()} content={
            <React.Fragment>
                {this.props.content}
                <Divider hidden />
                <Form>
                    { this.props.flags.map(f =>
                        <Form.Checkbox key={f.name} checked={this.state.flags[f.name]} label={f.label} {...f.props} onChange={(e, data) => this.setFlag(f.name, data.checked) } />
                    )}
                </Form>
            </React.Fragment>
        } onConfirm={() => this.props.onConfirm(this.state.flags)} onModalOpened={this.onOpen} />
    );
}


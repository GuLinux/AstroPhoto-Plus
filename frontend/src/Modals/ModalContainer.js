import { connect } from 'react-redux'
import Actions from '../actions'
import { ModalDialog } from './ModalDialog'
import React from 'react'

const mapStateToProps = (state, ownProps) => ({
    visible: !!state.modals[ownProps.name]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(ModalDialog)

const mapToggleModalDispatchToProps = (toggleKey) => (dispatch, ownProps) => {
    let toggle = () => {
        if(ownProps.beforeToggle && !ownProps.beforeToggle())
            return;
        dispatch(Actions.Modals.toggleModal(ownProps.modal, ownProps.action === 'visible'))
        ownProps.afterToggle && ownProps.afterToggle()
    }
    return { [toggleKey]: toggle };
}

const mergeToggleProps = (stateProps, dispatchProps, ownProps) => {
    const { beforeToggle, afterToggle, modal, action, ...rest } = ownProps;
    return {...stateProps, ...rest, ...dispatchProps};
}

const toggleProps = (props) => {
    let newProps = {...props};
    delete newProps.action;
    return newProps;
}

ModalContainer.MenuItem = {
    Toggle: connect(null, mapToggleModalDispatchToProps('onSelect'), mergeToggleProps)(ModalDialog.MenuItem),
    Close: (props) => <ModalContainer.MenuItem.Toggle action="close" {...toggleProps(props)} />,
    Open: (props) => <ModalContainer.MenuItem.Toggle action="visible" {...toggleProps(props)} />,
}

ModalContainer.Button = {
    Toggle: connect(null, mapToggleModalDispatchToProps('onClick'), mergeToggleProps)(ModalDialog.Button),
    Close: (props) => <ModalContainer.Button.Toggle action="close" {...toggleProps(props)} />,
    Open: (props) => <ModalContainer.Button.Toggle action="visible" {...toggleProps(props)} />,
}

export default ModalContainer;

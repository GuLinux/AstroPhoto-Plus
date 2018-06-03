import { connect } from 'react-redux'
import Actions from '../actions'
import { ModalDialog } from './ModalDialog'
import { Button, MenuItem } from 'react-bootstrap'
import React from 'react'

const mapStateToProps = (state, ownProps) => ({
    visible: !!state.navigation.modals[ownProps.name]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    close: () => dispatch(Actions.Navigation.toggleModal(ownProps.name, false)),
})

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(ModalDialog)

const mapToggleModalDispatchToProps = (toggleKey) => (dispatch, ownProps) => {
    let toggle = () => {
        if(ownProps.beforeToggle && !ownProps.beforeToggle())
            return;
        dispatch(Actions.Navigation.toggleModal(ownProps.modal, ownProps.action === 'visible'))
        ownProps.afterToggle && ownProps.afterToggle()
    }
    return { [toggleKey]: toggle };
}

const mergeToggleProps = (stateProps, dispatchProps, ownProps) => {
    const { beforeToggle, afterToggle, modal, action, ...rest } = ownProps;
    return {...stateProps, ...rest, ...dispatchProps};
}

ModalContainer.MenuItem = {
    Toggle: connect(null, mapToggleModalDispatchToProps('onSelect'), mergeToggleProps)(MenuItem),
    Close: (props) => <ModalContainer.MenuItem.Toggle action="close" {...props} />,
    Open: (props) => <ModalContainer.MenuItem.Toggle action="visible" {...props} />,
}

ModalContainer.Button = {
    Toggle: connect(null, mapToggleModalDispatchToProps('onClick'), mergeToggleProps)(Button),
    Close: (props) => <ModalContainer.Button.Toggle action="close" {...props} />,
    Open: (props) => <ModalContainer.Button.Toggle action="visible" {...props} />,

}



export default ModalContainer;

import { connect } from 'react-redux'
import Actions from '../actions'
import { ModalDialog } from '../components/ModalDialog'
import { Button } from 'react-bootstrap'
import React from 'react'

const mapStateToProps = (state, ownProps) => ({
    visible: !!state.navigation.modals[ownProps.name]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    close: () => dispatch(Actions.Navigation.toggleModal(ownProps.name, false)),
})

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(ModalDialog)

const mapToggleModalButtonDispatchToProps = (dispatch, ownProps) => {
    let onClick = () => {
        if(ownProps.beforeToggle && !ownProps.beforeToggle())
            return;
        dispatch(Actions.Navigation.toggleModal(ownProps.modal, ownProps.action === 'visible'))
        ownProps.afterToggle && ownProps.afterToggle()
    }
    return { onClick };
}

const mergeButtonProps = (stateProps, dispatchProps, ownProps) => {
    const { beforeToggle, afterToggle, modal, action, ...rest } = ownProps;
    return {...stateProps, ...dispatchProps, ...rest};
}
const ToggleModalButton = connect(null, mapToggleModalButtonDispatchToProps, mergeButtonProps)(Button)
ModalContainer.Toggle = ToggleModalButton;
ModalContainer.Close = (props) => <ModalContainer.Toggle action="close" {...props} />
ModalContainer.Open= (props) => <ModalContainer.Toggle action="visible" {...props} />

export default ModalContainer;

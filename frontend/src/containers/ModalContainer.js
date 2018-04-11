import { connect } from 'react-redux'
import Actions from '../actions'
import { ModalDialog, ShowModalDialogButton } from '../components/ModalDialog'

const mapStateToProps = (state, ownProps) => ({
    visible: !!state.navigation.modals[ownProps.name]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    close: () => dispatch(Actions.Navigation.toggleModal(ownProps.name, false)),
})

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(ModalDialog)

export const ShowModalDialogButtonContainer = connect(null, (dispatch, ownProps) => ({ onClick: () => dispatch(Actions.Navigation.toggleModal(ownProps.modal, true)) }))(ShowModalDialogButton)

export default ModalContainer;

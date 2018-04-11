import { connect } from 'react-redux'
import Actions from '../actions'
import ModalDialog from '../components/ModalDialog'

const mapStateToProps = (state, ownProps) => ({
    visible: !!state.navigation.modals[ownProps.name]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    close: () => dispatch(Actions.Navigation.toggleModal(ownProps.name, false)),
})

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(ModalDialog)

export default ModalContainer;

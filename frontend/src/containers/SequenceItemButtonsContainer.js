import { connect } from 'react-redux'
import Actions from '../actions'
import SequenceItemButtons from '../components/SequenceItemButtons'


const mapStateToProps = (state) => {
    let sequenceId = state.navigation.sequencesPage.sequenceID;
    let sequenceItemId = state.navigation.sequencesPage.sequenceItemID;
    return { sequenceId, sequenceItemId }

}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSave: (sequenceItem) => dispatch(Actions.SequenceItems.saveSequenceItem(sequenceItem)),
        navigateBack: (sequence) => dispatch(Actions.Navigation.toSequence('sequence', sequence))
    }
}

const SequenceItemButtonsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SequenceItemButtons)

export default SequenceItemButtonsContainer


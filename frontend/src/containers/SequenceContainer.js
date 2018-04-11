import { connect } from 'react-redux'
import Sequence from '../components/Sequence'
import Actions from '../actions'


const mapStateToProps = (state) => {
    let sequenceId = state.navigation.sequencesPage.sequenceID;
    if(!(sequenceId in state.sequences.entities)) {
        return { sequence: null }
    }
    let sequence = state.sequences.entities[sequenceId];
    return {sequence}
}

const mapDispatchToProps = (dispatch, props) => {
    let navigateBack = () => dispatch(Actions.Navigation.toSequence('sequences'));
    let onCreateSequenceItem = (type, sequenceId) => {
        dispatch(Actions.SequenceItems.newPending(type, sequenceId));
        dispatch(Actions.Navigation.toSequenceItem('sequence-item', 'pending'));
    }
    return { navigateBack, onCreateSequenceItem, }
}

const SequenceContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sequence)

export default SequenceContainer


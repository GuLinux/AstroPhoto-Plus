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

const mapDispatchToProps = (dispatch, props) => ({
    navigateBack: () => dispatch(Actions.Navigation.toSequence('sequences')),
    startSequence: (sequence) => dispatch(Actions.Sequences.start(sequence)),
    onCreateSequenceItem: (type, sequenceId) => {
        dispatch(Actions.SequenceItems.newPending(type, sequenceId));
        dispatch(Actions.Navigation.toSequenceItem('sequence-item', 'pending'));
    }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    onCreateSequenceItem: type => dispatchProps.onCreateSequenceItem(type, stateProps.sequence.id),
    startSequence: () => dispatchProps.startSequence(stateProps.sequence),
})

const SequenceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Sequence)

export default SequenceContainer


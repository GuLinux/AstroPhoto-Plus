import { connect } from 'react-redux';
import { Sequence, SequenceSectionMenu } from './Sequence';
import Actions from '../actions';
import { getSequencesGears } from '../Gear/selectors';
import { getSequenceEntitiesWithJobs } from './selectors';

const mapStateToProps = (state, ownProps) => {
    let sequenceId = ownProps.sequenceId;
    if(!(sequenceId in state.sequences.entities)) {
        return { sequence: null }
    }
    const sequence = getSequenceEntitiesWithJobs(state)[sequenceId];
    let gear = getSequencesGears(state)[sequenceId];

    let properties = {sequence, camera: gear.camera, filterWheel: gear.filterWheel, gear};
    return properties;
}


const mapDispatchToProps = (dispatch, props) => ({
    startSequence: (sequence) => dispatch(Actions.Sequences.start(sequence)),
    stopSequence: (sequence) => dispatch(Actions.Sequences.stop(sequence)),
    onCreateSequenceJob: (type, sequenceId) => {
        dispatch(Actions.SequenceJobs.newPending(type, sequenceId));
    },
    resetSequence: (sequence, options) => dispatch(Actions.Sequences.reset(sequence, options)),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    onCreateSequenceJob: type => dispatchProps.onCreateSequenceJob(type, stateProps.sequence.id),
    startSequence: () => dispatchProps.startSequence(stateProps.sequence),
    stopSequence: () => dispatchProps.stopSequence(stateProps.sequence),
    resetSequence: (options) => dispatchProps.resetSequence(stateProps.sequence, options),
})

export const SequenceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Sequence)

export const SequenceSectionMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SequenceSectionMenu)


import { connect } from 'react-redux';
import Sequence from './Sequence';
import Actions from '../actions';
import { getSequencesGears } from '../Gear/selectors';
import { getSequenceEntitiesWithItems } from './selectors';

const mapStateToProps = (state, ownProps) => {
    let sequenceId = ownProps.sequenceId;
    if(!(sequenceId in state.sequences.entities)) {
        return { sequence: null }
    }
    const sequence = getSequenceEntitiesWithItems(state)[sequenceId];
    let gear = getSequencesGears(state)[sequenceId];

    let properties = {sequence, camera: gear.camera, filterWheel: gear.filterWheel, canEdit: canEdit(state, sequence), gear};
    return properties;
}

const canEdit = (state, sequence) => {
    let gear = getSequencesGears(state)[sequence.id];
    if(gear.camera && ! gear.camera.connected)
        return false;
    if(gear.filterWheel && ! gear.filterWheel.connected)
        return false;
    return ['idle', 'error'].includes(sequence.status)
}


const mapDispatchToProps = (dispatch, props) => ({
    startSequence: (sequence) => dispatch(Actions.Sequences.start(sequence)),
    onCreateSequenceJob: (type, sequenceId) => {
        dispatch(Actions.SequenceJobs.newPending(type, sequenceId));
    },
    onMount: (items) => dispatch(Actions.Navigation.setRightMenu(items)),
    onUnmount: () => dispatch(Actions.Navigation.resetRightMenu()),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    onCreateSequenceJob: type => dispatchProps.onCreateSequenceJob(type, stateProps.sequence.id),
    startSequence: () => dispatchProps.startSequence(stateProps.sequence),
})

const SequenceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Sequence)

export default SequenceContainer

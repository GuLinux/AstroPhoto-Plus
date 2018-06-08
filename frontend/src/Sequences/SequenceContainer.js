import { connect } from 'react-redux'
import Sequence from './Sequence'
import Actions from '../actions'
import { getGears } from '../Gear/selectors'

const mapStateToProps = (state, ownProps) => {
    let sequenceId = ownProps.sequenceId;
    if(!(sequenceId in state.sequences.entities)) {
        return { sequence: null }
    }
    let sequence = state.sequences.entities[sequenceId];
    let gear = getGears(state)[sequenceId];
    let properties = {sequence, camera: gear.camera, filterWheel: gear.filterWheel, canEdit: canEdit(state, sequence)};
    return properties;
}

const canEdit = (state, sequence) => {
    let gear = getGears(state)[sequence.id];
    if(gear.camera && ! gear.camera.connected)
        return false;
    if(gear.filterWheel && ! gear.filterWheel.connected)
        return false;
    return ['idle', 'error'].includes(sequence.status)
}


const mapDispatchToProps = (dispatch, props) => ({
    startSequence: (sequence) => dispatch(Actions.Sequences.start(sequence)),
    onCreateSequenceItem: (type, sequenceId) => {
        dispatch(Actions.SequenceItems.newPending(type, sequenceId));
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

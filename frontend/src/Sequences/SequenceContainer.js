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


const mapDispatchToProps = {
    startSequence: Actions.Sequences.start,
    stopSequence: Actions.Sequences.stop,
    onCreateSequenceJob: Actions.SequenceJobs.newPending,
    resetSequence: Actions.Sequences.reset,
}


export const SequenceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Sequence)

export const SequenceSectionMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SequenceSectionMenu)


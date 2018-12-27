import { connect } from 'react-redux';
import { Sequence, SequenceSectionMenu } from './Sequence';
import Actions from '../actions';
import { sequenceSelector, sequenceSectionMenuSelector } from './selectors';


const mapDispatchToProps = {
    startSequence: Actions.Sequences.start,
    stopSequence: Actions.Sequences.stop,
    onCreateSequenceJob: Actions.SequenceJobs.newPending,
    resetSequence: Actions.Sequences.reset,
}


export const SequenceContainer = connect(
    sequenceSelector,
    mapDispatchToProps,
)(Sequence)

export const SequenceSectionMenuContainer = connect(
    sequenceSectionMenuSelector,
    mapDispatchToProps,
)(SequenceSectionMenu)


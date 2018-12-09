import { connect } from 'react-redux';
import { Sequence, SequenceSectionMenu } from './Sequence';
import Actions from '../actions';
import { sequenceSelector, sequenceSectionMenuSelector } from './selectors';

const sequenceMapStateToProps = (state, ownProps) => sequenceSelector(ownProps.sequenceId);
const sequenceSectionMenuMapStateToProps = (state, ownProps) => sequenceSectionMenuSelector(ownProps.sequenceId);


const mapDispatchToProps = {
    startSequence: Actions.Sequences.start,
    stopSequence: Actions.Sequences.stop,
    onCreateSequenceJob: Actions.SequenceJobs.newPending,
    resetSequence: Actions.Sequences.reset,
}


export const SequenceContainer = connect(
    sequenceMapStateToProps,
    mapDispatchToProps,
)(Sequence)

export const SequenceSectionMenuContainer = connect(
    sequenceSectionMenuMapStateToProps,
    mapDispatchToProps,
)(SequenceSectionMenu)


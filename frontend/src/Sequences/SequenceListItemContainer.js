import { connect } from 'react-redux';
import { SequenceListItem } from './SequenceListItem';
import Actions from '../actions';
import { getSequenceListItemSelector } from './selectors';

const mapDispatchToProps = {
    onSequenceDelete: Actions.Sequences.remove,
    startSequence: Actions.Sequences.start,
    duplicateSequence: Actions.Sequences.duplicate,
    stopSequence: Actions.Sequences.stop,
    resetSequence: Actions.Sequences.reset,
}

export const SequenceListItemContainer = connect(getSequenceListItemSelector, mapDispatchToProps)(SequenceListItem);

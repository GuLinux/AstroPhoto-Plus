import { connect } from 'react-redux';
import { ImportSequence } from './ImportSequence';
import Actions from '../actions';


const mapDispatchToProps = {
    onFileUploaded: Actions.Sequences.import,
};

export const ImportSequenceContainer = connect(null, mapDispatchToProps)(ImportSequence);



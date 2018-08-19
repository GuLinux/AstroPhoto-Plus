import { connect } from 'react-redux';
import ImportSequenceDialog from './ImportSequenceDialog';
import Actions from '../actions';


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    importSequence: (data) => dispatch(Actions.Sequences.import(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportSequenceDialog);



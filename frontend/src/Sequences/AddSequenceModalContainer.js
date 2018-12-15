import { connect } from 'react-redux';
import { addSequenceModalSelector } from './selectors';
import AddSequenceModal from './AddSequenceModal';
import Actions from '../actions';


const mapDispatchToProps = {
    onAddSequence: Actions.Sequences.add,
    onEditSequence: Actions.Sequences.edit,
}

const AddSequenceModalContainer = connect(
  addSequenceModalSelector,
  mapDispatchToProps
)(AddSequenceModal)

export default AddSequenceModalContainer

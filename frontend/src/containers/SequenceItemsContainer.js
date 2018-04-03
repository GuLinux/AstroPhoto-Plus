import { connect } from 'react-redux'
import SequenceItemsList from '../components/SequenceItemsList'


const mapStateToProps = (state, ownProps) => {
  let sequence = state.sequences.entities[ownProps.sequenceId];
  return {
    sequenceItems: sequence.sequenceItems.map(id => state.sequenceItems[id])
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const SequenceItemsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SequenceItemsList)

export default SequenceItemsContainer


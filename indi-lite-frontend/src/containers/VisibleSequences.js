import { connect } from 'react-redux'
import SequencesList from '../components/SequencesList'

const getVisibleSequences = (sequences, sessionId) => {
  return sequences.filter(sequence => sequence.session === sessionId);
/*  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
*/
}

const mapStateToProps = (state, ownProps) => {
  return {
    sequences: getVisibleSequences(state.sequences, ownProps.sessionId)
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const VisibleSequences = connect(
  mapStateToProps,
  mapDispatchToProps
)(SequencesList)

export default VisibleSequences


import { connect } from 'react-redux'
import SequencesList from '../components/SequencesList'

const getVisibleSequences = (sequences) => {
  return sequences;
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

const mapStateToProps = state => {
  return {
    sequences: getVisibleSequences(state.sequences)
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


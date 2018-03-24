import { connect } from 'react-redux'
import SequencesList from '../components/SequencesList'


const mapStateToProps = (state, ownProps) => {
  let session = state.sessions.entities[ownProps.sessionId];
  return {
    sequences: session.sequences.map(id => state.sequences[id])
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const SequencesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SequencesList)

export default SequencesContainer


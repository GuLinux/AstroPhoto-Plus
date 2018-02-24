import { connect } from 'react-redux'
import SessionsList from '../components/SessionsList'
import { addSequence } from '../actions'

const getVisibleSessions = (sessions, sequences) => {
  return sessions;
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
console.log(state);
  return {
    sessions: getVisibleSessions(state.sessions, state.sequences)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCreateSequence: (name, sessionId) => dispatch(addSequence(name, sessionId))
  }
}

const VisibleSessions = connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionsList)

export default VisibleSessions


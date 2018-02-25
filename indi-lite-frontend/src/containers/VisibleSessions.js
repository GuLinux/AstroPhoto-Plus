import { connect } from 'react-redux'
import SessionsList from '../components/SessionsList'
import { addSequence } from '../actions'

const getVisibleSessions = (entities, ids) => {
  return ids.map(id => entities[id])
}

const mapStateToProps = state => {
  return {
    sessions: getVisibleSessions(state.sessions.entities, state.sessions.ids)
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


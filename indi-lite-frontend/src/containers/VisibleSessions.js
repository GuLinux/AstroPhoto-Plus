import { connect } from 'react-redux'
import SessionsList from '../components/SessionsList'
import { navigateToSession } from '../actions'

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
    onSessionEdit: (sessionId) => dispatch(navigateToSession('session', sessionId))
  }
}

const VisibleSessions = connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionsList)

export default VisibleSessions


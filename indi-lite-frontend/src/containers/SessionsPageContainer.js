import { connect } from 'react-redux'
import SessionsPage from '../components/SessionsPage'
import Actions from '../actions'

const getSessions = (entities, ids) => {
  return ids.map(id => entities[id])
}

const mapStateToProps = state => {
  return {
    sessions: getSessions(state.sessions.entities, state.sessions.ids)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSessionEdit: (sessionId) => dispatch(Actions.Navigation.toSession('session', sessionId)),
    onSessionDelete: (sessionId) => dispatch(Actions.Sessions.remove(sessionId)),
    onAddSession: (sessionName) => dispatch(Actions.Sessions.add(sessionName))
  }
}

const SessionsPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionsPage)

export default SessionsPageContainer


import { connect } from 'react-redux'
import SessionsList from '../components/SessionsList'
import Actions from '../actions'

const getSessions = (entities, ids) => {
  return ids.map(id => entities[id])
}

const mapStateToProps = state => {

    let cameras = state.gear.cameras.reduce( (cameras, id) => ({...cameras, [id]: state.gear.cameraEntities[id].device.name }), {} );

    return {
        sessions: getSessions(state.sessions.entities, state.sessions.ids),
        cameras,
    }
}

const mapDispatchToProps = dispatch => {
  return {
    onSessionEdit: (sessionId) => dispatch(Actions.Navigation.toSession('session', sessionId)),
    onSessionDelete: (sessionId) => dispatch(Actions.Sessions.remove(sessionId)),
  }
}

const SessionsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionsList)

export default SessionsListContainer


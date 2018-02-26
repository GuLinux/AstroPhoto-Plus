import { connect } from 'react-redux'
import Session from '../components/Session'
import { addSequence, navigateToSession } from '../actions'


const mapStateToProps = (state) => {
  let sessionId = state.navigation.sessionId;
  if(!(sessionId in state.sessions.entities)) {
    return { session: null }
  }
  let session = state.sessions.entities[sessionId];
  return {session}
}

const mapDispatchToProps = dispatch => {
  return {
    onCreateSequence: (name, sessionId) => dispatch(addSequence(name, sessionId)),
    navigateBack: () => dispatch(navigateToSession('sessions'))
  }
}

const SessionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Session)

export default SessionContainer


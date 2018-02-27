import { connect } from 'react-redux'
import Session from '../components/Session'
import Actions from '../actions'


const mapStateToProps = (state) => {
    let sessionId = state.navigation.sessionId;
    if(!(sessionId in state.sessions.entities)) {
        return { session: null }
    }
    let session = state.sessions.entities[sessionId];
    return {session}
}

const mapDispatchToProps = dispatch => {
    let onCreateSequence = (name, sessionId) => dispatch(Actions.Sequences.add(name, sessionId));
    let navigateBack = () => dispatch(Actions.Navigation.toSession('sessions'));
    return { onCreateSequence, navigateBack }
}

const SessionController = connect(
    mapStateToProps,
    mapDispatchToProps
)(Session)

export default SessionController


import { connect } from 'react-redux'
import Sequence from '../components/Sequence'
import Actions from '../actions'


const mapStateToProps = (state) => {
    let sequenceId = state.navigation.sequenceId;
    if(!(sequenceId in state.sequences.entities)) {
        return { sequence: null }
    }
    let sequence = state.sequences.entities[sequenceId];
    return {sequence}
}

const mapDispatchToProps = dispatch => {
    let navigateBack = () => dispatch(Actions.Navigation.toSequence('sequences'));
    let onCreateSequenceItem = (name, sequenceId) => dispatch(Actions.SequenceItems.add(name, sequenceId))
    return { navigateBack, onCreateSequenceItem }
}

const SequenceContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sequence)

export default SequenceContainer


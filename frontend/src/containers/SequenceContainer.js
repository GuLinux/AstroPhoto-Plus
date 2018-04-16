import { connect } from 'react-redux'
import Sequence from '../components/Sequence'
import Actions from '../actions'


const mapStateToProps = (state) => {
    let sequenceId = state.navigation.sequencesPage.sequenceID;
    if(!(sequenceId in state.sequences.entities)) {
        return { sequence: null }
    }
    let sequence = state.sequences.entities[sequenceId];
    let properties = {sequence};
    if(state.indiserver.state.connected && state.indiserver.deviceEntities[sequence.camera]) {
        let camera = state.indiserver.deviceEntities[sequence.camera];
        let cameraProperties = Object.keys(state.indiserver.properties).map(key => state.indiserver.properties[key]).filter(p => p.device === camera.id);
        let exposureProperty = cameraProperties.find(p => p.name === 'CCD_EXPOSURE')
        let exposureAbortProperty = cameraProperties.find(p => p.name === 'CCD_ABORT_EXPOSURE')
        properties = {...properties, camera, exposureProperty, exposureAbortProperty}
    }
    return properties;
}

const mapDispatchToProps = (dispatch, props) => ({
    navigateBack: () => dispatch(Actions.Navigation.toSequence('sequences')),
    startSequence: (sequence) => dispatch(Actions.Sequences.start(sequence)),
    onCreateSequenceItem: (type, sequenceId) => {
        dispatch(Actions.SequenceItems.newPending(type, sequenceId));
        dispatch(Actions.Navigation.toSequenceItem('sequence-item', 'pending'));
    }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    onCreateSequenceItem: type => dispatchProps.onCreateSequenceItem(type, stateProps.sequence.id),
    startSequence: () => dispatchProps.startSequence(stateProps.sequence),
})

const SequenceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Sequence)

export default SequenceContainer


import { connect } from 'react-redux'
import ExposureSequenceJob from './ExposureSequenceJob'
import { getSequencesGears } from '../Gear/selectors'

const mapStateToProps = (state, ownProps) => {
    let gear = getSequencesGears(state)[ownProps.sequenceJob.sequence];
    return { camera: gear.camera, hasFilterWheel: !!gear.filterWheel }
}

const ExposureSequenceJobContainer = connect(
    mapStateToProps,
)(ExposureSequenceJob)

export default ExposureSequenceJobContainer


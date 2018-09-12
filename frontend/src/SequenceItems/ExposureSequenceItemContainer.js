import { connect } from 'react-redux'
import ExposureSequenceItem from './ExposureSequenceItem'
import { getSequencesGears } from '../Gear/selectors'

const mapStateToProps = (state, ownProps) => {
    let gear = getSequencesGears(state)[ownProps.sequenceItem.sequence];
    return { camera: gear.camera}
}

const ExposureSequenceItemContainer = connect(
    mapStateToProps,
)(ExposureSequenceItem)

export default ExposureSequenceItemContainer


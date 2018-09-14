import { connect } from 'react-redux'
import FilterSequenceJob from './FilterSequenceJob' 
import { getSequencesGears } from '../Gear/selectors'

const mapStateToProps = (state, ownProps) => {
    let gear = getSequencesGears(state)[ownProps.sequenceJob.sequence];
    return { filters: gear.filterWheel.filters }
}

const FilterSequenceJobContainer = connect(
    mapStateToProps,
)(FilterSequenceJob)

export default FilterSequenceJobContainer


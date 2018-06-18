import { connect } from 'react-redux'
import FilterSequenceItem from './FilterSequenceItem' 
import { getSequencesGears } from '../Gear/selectors'

const mapStateToProps = (state, ownProps) => {
    let gear = getSequencesGears(state)[ownProps.sequenceItem.sequence];
    return { filters: gear.filterWheel.filters }
}

const FilterSequenceItemContainer = connect(
    mapStateToProps,
)(FilterSequenceItem)

export default FilterSequenceItemContainer


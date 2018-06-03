import { connect } from 'react-redux'
import FilterSequenceItem from './FilterSequenceItem' 
import { getGears } from '../Gear/selectors'

const mapStateToProps = (state, ownProps) => {
    let gear = getGears(state)[ownProps.sequenceItem.sequence];
    return { filters: gear.filterWheel.filters }
}

const FilterSequenceItemContainer = connect(
    mapStateToProps,
)(FilterSequenceItem)

export default FilterSequenceItemContainer


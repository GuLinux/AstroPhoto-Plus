import { connect } from 'react-redux'
import FilterSequenceItem from '../components/FilterSequenceItem' 
import { getGears } from '../selectors/gear'

const mapStateToProps = (state, ownProps) => {
    let gear = getGears(state)[ownProps.sequenceItem.sequence];
    return { filters: gear.filterWheel.filters }
}

const FilterSequenceItemContainer = connect(
    mapStateToProps,
)(FilterSequenceItem)

export default FilterSequenceItemContainer


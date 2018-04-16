import { connect } from 'react-redux'
import FilterSequenceItem from '../components/FilterSequenceItem' 

const mapStateToProps = (state, ownProps) => {
    let sequence = state.sequences.entities[ownProps.sequenceItem.sequence];
    let filterProperty = Object.keys(state.indiserver.properties).map(p => state.indiserver.properties[p]).find(p => p.name === 'FILTER_NAME' && p.device === sequence.filterWheel)
    let filters = filterProperty.values.map( (v, index) => ({ name: v.value, number: index+1 }) );
    return { filters }
}

const FilterSequenceItemContainer = connect(
    mapStateToProps,
)(FilterSequenceItem)

export default FilterSequenceItemContainer


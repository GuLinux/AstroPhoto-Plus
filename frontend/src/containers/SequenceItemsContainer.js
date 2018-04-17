import { connect } from 'react-redux'
import SequenceItemsList from '../components/SequenceItemsList'
import Actions from '../actions'
import { filtersMap } from '../models/filterWheel'

const getTypeLabel = type => {
    switch(type) {
        case 'shots':
            return 'Exposures';
        case 'filter':
            return 'Filter Wheel';
        default:
            return '';
    }
}

const getDescription = (state, sequenceItem) => {
    switch(sequenceItem.type) {
        case 'shots':
            return `${sequenceItem.count} shots of ${sequenceItem.exposure} seconds, ${sequenceItem.count * sequenceItem.exposure} seconds total`;
        case 'filter':
            let sequence = state.sequences.entities[sequenceItem.sequence];
            let filterName = filtersMap(state, sequence.filterWheel).find(f => f.number == sequenceItem.filterNumber).name
            return `Set filter wheel to filter ${filterName} (${sequenceItem.filterNumber})`
        default:
            return '';
    }
}

const sequenceItemViewModel = (state, sequenceItem) => ({
    ...sequenceItem,
    typeLabel: getTypeLabel(sequenceItem.type),
    description: getDescription(state, sequenceItem),
})

const mapStateToProps = (state, ownProps) => {
  let sequence = state.sequences.entities[ownProps.sequenceId];
  return {
    sequenceItems: sequence.sequenceItems.map(id => sequenceItemViewModel(state, state.sequenceItems[id]))
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editSequenceItem: (sequenceItemId) => dispatch(Actions.Navigation.toSequenceItem('sequence-item', sequenceItemId)),
    deleteSequenceItem: (sequenceItem) => dispatch(Actions.SequenceItems.delete(sequenceItem)),
  }
}

const SequenceItemsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SequenceItemsList)

export default SequenceItemsContainer


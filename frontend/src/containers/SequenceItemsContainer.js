import { connect } from 'react-redux'
import SequenceItemsList from '../components/SequenceItemsList'
import Actions from '../actions'

const getTypeLabel = type => {
    switch(type) {
        case 'shots':
            return 'Exposures';
        default:
            return '';
    }
}

const getDescription = sequenceItem => {
    switch(sequenceItem.type) {
        case 'shots':
            return `${sequenceItem.count} shots of ${sequenceItem.exposure} seconds, ${sequenceItem.count * sequenceItem.exposure} seconds total`;
        default:
            return '';
    }
}

const sequenceItemViewModel = sequenceItem => ({
    ...sequenceItem,
    typeLabel: getTypeLabel(sequenceItem.type),
    description: getDescription(sequenceItem),
})

const mapStateToProps = (state, ownProps) => {
  let sequence = state.sequences.entities[ownProps.sequenceId];
  return {
    sequenceItems: sequence.sequenceItems.map(id => sequenceItemViewModel(state.sequenceItems[id]))
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


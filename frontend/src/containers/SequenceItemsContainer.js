import { connect } from 'react-redux'
import SequenceItemsList from '../components/SequenceItemsList'
import Actions from '../actions'
import { getGears } from '../selectors/gear'

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
            let gear = getGears(state)[sequenceItem.sequence];
            if(gear.filterWheel.connected)
                return `Set filter wheel to filter ${gear.filterWheel.numbers2names[sequenceItem.filterNumber]} (${sequenceItem.filterNumber})`
            return `Set filter wheel to filter ${sequenceItem.filterNumber}`

        default:
            return '';
    }
}

const canEdit = (state, sequenceItem) => {
    let gear = getGears(state)[sequenceItem.sequence];
    if(gear.camera && ! gear.camera.connected)
        return false;
    if(gear.filterWheel && ! gear.filterWheel.connected)
        return false;
    return true;
}

const sequenceItemViewModel = (state, sequenceItem) => ({
    ...sequenceItem,
    typeLabel: getTypeLabel(sequenceItem.type),
    description: getDescription(state, sequenceItem),
    canEdit: canEdit(state, sequenceItem),
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


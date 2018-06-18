import { connect } from 'react-redux';
import SelectFilter from './SelectFilter';
import { getConnectedFilterWheelEntities, getConnectedFilterWheelsObjects } from '../Gear/selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => {
    const currentFilterWheel = state.camera.currentFilterWheel;
    const filterWheelObject = getConnectedFilterWheelsObjects(state).find(f => f.id === currentFilterWheel);
    const filterWheelEntity = getConnectedFilterWheelEntities(state).find(f => f.id === currentFilterWheel);
    return {
        filterWheelEntity,
        currentFilter: filterWheelObject.currentFilter,
        availableFilters: filterWheelObject.filters,
        filterSlotProperty: filterWheelObject.filterSlotProperty,
        isPending: !!state.camera.pendingFilter,
    };
}

const mapDispatchToProps = dispatch => ({
    onFilterSelected: (filterNumber, filterWheelDevice, filterProperty) =>
        dispatch(Actions.Camera.changeFilter(filterWheelDevice, filterProperty, { FILTER_SLOT_VALUE: filterNumber })),
})

const SelectFilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFilter)


export default SelectFilterContainer;

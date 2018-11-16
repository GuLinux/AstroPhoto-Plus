import { connect } from 'react-redux';
import SelectFilter from './SelectFilter';
import { connectedFilterWheelsSelector } from '../Gear/selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => {
    const currentFilterWheel = state.camera.currentFilterWheel;
    const filterWheel = connectedFilterWheelsSelector(state).get(currentFilterWheel);
    return {
        filterWheel,
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

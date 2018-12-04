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

const onFilterSelected = (filterNumber, filterWheelDevice, filterProperty) => Actions.Camera.changeFilter(filterWheelDevice, filterProperty, { FILTER_SLOT_VALUE: filterNumber });


const mapDispatchToProps = {onFilterSelected};

const SelectFilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFilter)


export default SelectFilterContainer;

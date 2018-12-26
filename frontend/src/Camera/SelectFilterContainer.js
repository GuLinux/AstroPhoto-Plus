import { connect } from 'react-redux';
import { SelectFilter } from './SelectFilter';
import Actions from '../actions';
import { selectFilterSelector } from './selectors';


const mapDispatchToProps = {
  onFilterSelected: Actions.Camera.changeFilter,
};

export const SelectFilterContainer = connect(
  selectFilterSelector,
  mapDispatchToProps
)(SelectFilter)


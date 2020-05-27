import { connect } from 'react-redux';
import { SelectFilter } from './SelectFilter';
import { changeFilter } from './actions';
import { selectFilterSelector } from './selectors';

export const SelectFilterContainer = connect(
  selectFilterSelector,
    { onFilterSelected: changeFilter }
)(SelectFilter)


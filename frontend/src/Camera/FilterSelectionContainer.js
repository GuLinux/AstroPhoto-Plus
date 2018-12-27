import { connect } from 'react-redux';
import { FilterSelection } from './FilterSelection';
import { filterSelectionSelector } from './selectors';

export const FilterSelectionContainer = connect(filterSelectionSelector)(FilterSelection);
import { connect } from 'react-redux'
import { filterSequenceJobItemSelector } from './selectors';
import { FilterSequenceJobItem } from './FilterSequenceJobItem';

export const FilterSequenceJobItemContainer = connect(filterSequenceJobItemSelector)(FilterSequenceJobItem);


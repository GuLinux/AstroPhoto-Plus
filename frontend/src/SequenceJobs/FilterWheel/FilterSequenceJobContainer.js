import { connect } from 'react-redux'
import {FilterSequenceJob } from './FilterSequenceJob' 
import { filterWheelSequenceJobSelector } from '../selectors'

export const FilterSequenceJobContainer = connect(
    filterWheelSequenceJobSelector,
)(FilterSequenceJob)



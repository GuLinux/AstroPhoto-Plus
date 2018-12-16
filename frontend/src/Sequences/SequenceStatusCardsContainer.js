import { connect } from 'react-redux'
import { exposuresCardSelector, cameraDetailsCardSelector, filterWheelCardSelector } from './selectors';
import { ExposuresCard, CameraDetailsCard, FilterWheelDetailsCard } from './SequenceStatusCards';

export const ExposuresCardContainer = connect(exposuresCardSelector)(ExposuresCard);
export const CameraDetailsCardContainer = connect(cameraDetailsCardSelector)(CameraDetailsCard);
export const FilterWheelDetailsCardContainer = connect(filterWheelCardSelector)(FilterWheelDetailsCard);
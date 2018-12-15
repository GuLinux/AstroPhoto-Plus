import { connect } from 'react-redux'
import { exposuresCardSelector, cameraDetailsCardSelector } from './selectors';
import { ExposuresCard, CameraDetailsCard } from './SequenceStatusCards';

export const ExposuresCardContainer = connect(exposuresCardSelector)(ExposuresCard);
export const CameraDetailsCardContainer = connect(cameraDetailsCardSelector)(CameraDetailsCard);
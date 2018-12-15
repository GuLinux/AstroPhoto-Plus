import { connect } from 'react-redux'
import { exposuresCardSelector, cameraDetailsCardSelector } from './selectors';
import { ExposuresCard, CameraDetailsCard } from './SequenceStatusCards';

export const ExposuresCardContainer = connect((state, props) => exposuresCardSelector(props.sequenceId)(state))(ExposuresCard);
export const CameraDetailsCardContainer = connect((state, props) => cameraDetailsCardSelector(props.sequenceId)(state))(CameraDetailsCard);
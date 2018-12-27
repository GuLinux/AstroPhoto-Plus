import { connect } from 'react-redux';
import { INDIPropertySequenceJob } from './INDIPropertySequenceJob';
import { indiPropertySequenceJobSelector } from '../selectors';


export const INDIPropertySequenceJobContainer = connect(
  indiPropertySequenceJobSelector,
)(INDIPropertySequenceJob);



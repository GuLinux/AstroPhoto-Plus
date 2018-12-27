import { connect } from 'react-redux'
import { indiPropertyRowSelector } from './selectors';
import { INDIPropertyRow } from './INDIPropertyRow';

export const INDIPropertyRowContainer = connect(indiPropertyRowSelector)(INDIPropertyRow);

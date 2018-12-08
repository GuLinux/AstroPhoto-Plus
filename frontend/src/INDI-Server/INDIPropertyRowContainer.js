import { connect } from 'react-redux'
import { indiPropertyRowSelector } from './selectors-redo';
import { INDIPropertyRow } from './INDIPropertyRow';

export const INDIPropertyRowContainer = connect(indiPropertyRowSelector)(INDIPropertyRow);

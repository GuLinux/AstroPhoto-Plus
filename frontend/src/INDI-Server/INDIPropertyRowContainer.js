import { connect } from 'react-redux'
import { indiPropertyRowSelector } from './selectors';
import { INDIPropertyRow } from './INDIPropertyRow';

const mapStateToProps = (state, {propertyId}) => indiPropertyRowSelector(propertyId)(state);

export const INDIPropertyRowContainer = connect(mapStateToProps)(INDIPropertyRow);

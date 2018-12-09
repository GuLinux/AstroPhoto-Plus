import { connect } from 'react-redux'
import { indiValueSelector } from './selectors-redo';
import { INDISwitch } from './INDISwitch';
import { INDIText } from './INDIText';
import { INDINumber } from './INDINumber';
import { INDILight } from './INDILight';

const mapDispatchToProps = (state, props) => indiValueSelector(props.valueId)(state);

export const INDISwitchContainer = connect(mapDispatchToProps)(INDISwitch);
export const INDILightContainer = connect(mapDispatchToProps)(INDILight);
export const INDITextContainer = connect(mapDispatchToProps)(INDIText);
export const INDINumberContainer = connect(mapDispatchToProps)(INDINumber);

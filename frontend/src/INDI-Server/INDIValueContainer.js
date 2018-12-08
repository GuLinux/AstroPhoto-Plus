import { connect } from 'react-redux'
import { indiValueSelector } from './selectors-redo';
import { INDISwitch } from './INDISwitch';
import { INDIText } from './INDIText';
import { INDINumber } from './INDINumber';
import { INDILight } from './INDILight';

export const INDISwitchContainer = connect(indiValueSelector)(INDISwitch);
export const INDILightContainer = connect(indiValueSelector)(INDILight);
export const INDITextContainer = connect(indiValueSelector)(INDIText);
export const INDINumberContainer = connect(indiValueSelector)(INDINumber);
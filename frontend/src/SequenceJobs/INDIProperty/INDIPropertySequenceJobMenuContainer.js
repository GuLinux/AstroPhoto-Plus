import { connect } from 'react-redux';
import {
    INDIPropertySequenceJobDeviceMenu,
    INDIPropertySequenceJobGroupMenu,
    INDIPropertySequenceJobValues
} from './INDIPropertySequenceJobMenu';

import {
    indiPropertySequenceJobDeviceMenuSelector,
    indiPropertySequenceJobDeviceGroupMenuSelector,
    indiPropertySequenceJobValuesMenuSelector
} from '../selectors';

export const INDIPropertySequenceJobDeviceMenuContainer = connect(indiPropertySequenceJobDeviceMenuSelector)(INDIPropertySequenceJobDeviceMenu);
export const INDIPropertySequenceJobGroupMenuContainer = connect(indiPropertySequenceJobDeviceGroupMenuSelector)(INDIPropertySequenceJobGroupMenu);
export const INDIPropertySequenceJobValuesMenuContainer = connect(indiPropertySequenceJobValuesMenuSelector)(INDIPropertySequenceJobValues);


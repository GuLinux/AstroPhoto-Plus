import { connect } from 'react-redux';
import { INDIPropertySequenceJobDeviceMenu, INDIPropertySequenceJobGroupMenu } from './INDIPropertySequenceJobMenu';
import { indiPropertySequenceJobDeviceMenuSelector, indiPropertySequenceJobDeviceGroupMenuSelector } from '../selectors';

export const INDIPropertySequenceJobDeviceMenuContainer = connect(indiPropertySequenceJobDeviceMenuSelector)(INDIPropertySequenceJobDeviceMenu);
export const INDIPropertySequenceJobGroupMenuContainer = connect(indiPropertySequenceJobDeviceGroupMenuSelector)(INDIPropertySequenceJobGroupMenu);


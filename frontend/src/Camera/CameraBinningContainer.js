import { connect } from 'react-redux';
import { CameraBinning } from './CameraBinning';
import { cameraBinningSelector } from './selectors';
import Actions from '../actions';

export const CameraBinningContainer = connect(cameraBinningSelector, { setOption: Actions.Camera.setOption })(CameraBinning);

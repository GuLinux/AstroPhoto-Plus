import { connect } from 'react-redux';
import { CameraBinning } from './CameraBinning';
import { cameraBinningSelector } from './selectors';
import { setOption } from './actions';

export const CameraBinningContainer = connect(cameraBinningSelector, { setOption })(CameraBinning);

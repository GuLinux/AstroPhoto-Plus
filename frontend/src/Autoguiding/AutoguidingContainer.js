import { connect } from 'react-redux';
import { autoguidingSelector } from './selectors';
import { Autoguiding } from './Autoguiding';
import { startPHD2Server, stopPHD2Server, resetPHD2Server } from './actions';

export const AutoguidingContainer = connect(autoguidingSelector, {
    startPHD2Server,
    stopPHD2Server,
    resetPHD2Server,
})(Autoguiding);

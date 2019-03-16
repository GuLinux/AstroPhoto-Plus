import { connect } from 'react-redux';
import { autoguidingSelector } from './selectors';
import { Autoguiding } from './Autoguiding';

export const AutoguidingContainer = connect(autoguidingSelector, {
})(Autoguiding);

import { connect } from 'react-redux';
import { backendSelectionSelector } from './selectors';
import { BackendSelectionPage } from './BackendSelectionPage';
import Actions from '../actions';

export const BackendSelectionContainer = connect(backendSelectionSelector, {
    saveBackend: Actions.BackendSelection.saveBackend,
})(BackendSelectionPage);
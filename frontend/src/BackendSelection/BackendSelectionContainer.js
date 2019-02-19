import { connect } from 'react-redux';
import { backendSelectionSelector } from './selectors';
import { BackendSelectionPage } from './BackendSelectionPage';

export const BackendSelectionContainer = connect(backendSelectionSelector)(BackendSelectionPage);
import { connect } from 'react-redux';
import { App } from './App';
import { appSelector } from './selectors';

export const AppContainer = connect(appSelector)(App);
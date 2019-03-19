import { connect } from 'react-redux';
import { App } from './App';
import { appSelector } from './appContainerSelector';

export const AppContainer = connect(appSelector)(App);

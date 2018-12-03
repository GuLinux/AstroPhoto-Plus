/** @format */

import {AppRegistry} from 'react-native';
import App from './components/App';
import {name as appName} from '../app.json';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { Actions } from './actions';
import thunkMiddleware from 'redux-thunk';
import { Routes } from './routes';
import { starQuewReducer } from './reducers';
import registerServiceWorker from './registerServiceWorker';
//import listenToEvents from './middleware/events';
import { NativeRouter as Router, Route } from 'react-router-native'


const loggerMiddleware = createLogger()

const createMiddleware = () => {
    const devMode = process.env.NODE_ENV === 'development';
    const disableLogger = true;
    const composeEnhancers = (devMode && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const middlewares = [thunkMiddleware];
    devMode && ! disableLogger && middlewares.push(loggerMiddleware);
    return composeEnhancers(applyMiddleware(...middlewares));
}

let store = createStore(
    starQuewReducer,
    createMiddleware()
);

//listenToEvents(store.dispatch);

const renderIndex = () => (
    <Provider store={store}>
        <Router>
            <Route path={Routes.ROOT}>
                {({location}) => <App location={location} /> }
            </Route>
        </Router>
    </Provider>
);

AppRegistry.registerComponent(appName, () => renderIndex);

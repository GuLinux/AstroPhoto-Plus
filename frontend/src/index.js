import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { init } from './App/actions';
import thunkMiddleware from 'redux-thunk';

import { astroPhotoPlusReducer } from './reducers'
import { isDevelopmentMode } from './utils';

import { initialiseApp } from './initialiseApp';

import React from 'react';
import { Provider } from 'react-redux';

import { AppContainer } from './App/AppContainer';

const loggerMiddleware = createLogger()

const createMiddleware = () => {
    const disableLogger = true;
    //const composeEnhancers = (isDevelopmentMode && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({maxAge: 200})) || compose;
    const composeEnhancers = (isDevelopmentMode && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const middlewares = [thunkMiddleware];
    isDevelopmentMode && ! disableLogger && middlewares.push(loggerMiddleware);
    return composeEnhancers(applyMiddleware(...middlewares));
}

// if(isDevelopmentMode) {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render');
//     whyDidYouRender(React, {include: [/.*/]});
// }

let store = createStore(
    astroPhotoPlusReducer,
    createMiddleware()
)

store.dispatch(init());


initialiseApp(
    <Provider store={store}>
        <AppContainer />
    </Provider>);

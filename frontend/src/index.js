import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { Actions } from './actions';
import thunkMiddleware from 'redux-thunk';
import { Routes } from './routes';

import { starQuewReducer } from './reducers'
import App from './components/App'

import 'react-image-crop/dist/ReactCrop.css';

import './index.css';

import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom'

// if (process.env.NODE_ENV !== 'production') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {include: [/SequenceListItem/]});
// }

const loggerMiddleware = createLogger()

const createMiddleware = () => {
    const devMode = process.env.NODE_ENV === 'development';
    const disableLogger = true;
    //const composeEnhancers = (devMode && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({maxAge: 200})) || compose;
    const composeEnhancers = (devMode && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const middlewares = [thunkMiddleware];
    devMode && ! disableLogger && middlewares.push(loggerMiddleware);
    return composeEnhancers(applyMiddleware(...middlewares));
}

let store = createStore(
    starQuewReducer,
    createMiddleware()
)

store.dispatch(Actions.init());

render(
  <Provider store={store}>
    <Router>
        <Route path={Routes.ROOT}>
            {({location}) => <App location={location} /> }
        </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();

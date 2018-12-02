import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { Actions } from './actions'
import thunkMiddleware from 'redux-thunk'
import { Routes } from './routes'

import { starQuewReducer } from './reducers'
import App from './components/App'

import 'react-image-crop/dist/ReactCrop.css';

import './index.css';

import registerServiceWorker from './registerServiceWorker';
import listenToEvents from './middleware/events';

import { BrowserRouter as Router, Route } from 'react-router-dom'

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
)

store.dispatch(Actions.fetchBackendVersion())
store.dispatch(Actions.Sequences.fetch())
store.dispatch(Actions.INDIServer.fetchServerState(true))
store.dispatch(Actions.INDIService.fetchService())
store.dispatch(Actions.INDIService.fetchProfiles())
store.dispatch(Actions.Commands.get())
store.dispatch(Actions.Settings.fetch())
listenToEvents(store.dispatch)

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

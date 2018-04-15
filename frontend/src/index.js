import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { Actions } from './actions'
import thunkMiddleware from 'redux-thunk'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './bootstrap-theme/css/bootstrap.css'


import indiLiteApp from './reducers'
import App from './components/App'
import './index.css';

import registerServiceWorker from './registerServiceWorker';
import listenToEvents from './middleware/events';

const loggerMiddleware = createLogger()

let store = createStore(indiLiteApp, applyMiddleware(thunkMiddleware, loggerMiddleware))
store.dispatch(Actions.Sequences.fetch())
store.dispatch(Actions.INDIServer.fetchServerState(true))
listenToEvents(store.dispatch)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();

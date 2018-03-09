import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { Actions } from './actions'
import thunkMiddleware from 'redux-thunk'

import indiLiteApp from './reducers'
import App from './components/App'
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import registerServiceWorker from './registerServiceWorker';

const loggerMiddleware = createLogger()

let store = createStore(indiLiteApp, applyMiddleware(thunkMiddleware, loggerMiddleware))
store.dispatch(Actions.Sessions.fetch())
store.dispatch(Actions.INDIServer.fetchServerState())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();

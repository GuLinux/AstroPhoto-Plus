import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { Actions } from './actions'
import thunkMiddleware from 'redux-thunk'

import 'semantic-ui-css/semantic.min.css';
// TODO: restore when it is working again
// import 'forest-themes-css/dist/bootswatch/semantic.darkly.min.css';
//import './semantic-ui-themes/bootswatch/semantic.solar.min.css'


import indiLiteApp from './reducers'
import App from './components/App'

import 'react-image-crop/dist/ReactCrop.css';

import './index.css';

import registerServiceWorker from './registerServiceWorker';
import listenToEvents from './middleware/events';

import { BrowserRouter as Router, Route } from 'react-router-dom'


const loggerMiddleware = createLogger()

const createMiddleware = () => {
    if(window.__REDUX_DEVTOOLS_EXTENSION__)
        return applyMiddleware(thunkMiddleware);
    return applyMiddleware(thunkMiddleware, loggerMiddleware)
}

let store = createStore(
    indiLiteApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    createMiddleware()
)

store.dispatch(Actions.Sequences.fetch())
store.dispatch(Actions.INDIServer.fetchServerState(true))
store.dispatch(Actions.INDIService.fetchService())
store.dispatch(Actions.INDIService.fetchProfiles())
store.dispatch(Actions.Settings.fetch())
listenToEvents(store.dispatch)

render(
  <Provider store={store}>
    <Router>
        <Route path="/">
            {({location}) => <App location={location} /> }
        </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();

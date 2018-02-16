import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import indiLiteApp from './reducers'
import App from './components/App'
import './index.css';

import registerServiceWorker from './registerServiceWorker';

let store = createStore(indiLiteApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();

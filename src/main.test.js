import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './containers/App/App'
import createStore from './store/createStore'

it('renders without crashing', () => {
  // console.log(process.env)
  const MOUNT_NODE   = document.createElement('div'),
        initialState = window.___INITIAL_STATE__,
        store        = createStore(initialState),
        routes       = require('./routes/index').default(store)

  ReactDOM.render(<AppContainer store={store} routes={routes}/>, MOUNT_NODE)
});
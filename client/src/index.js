import App from './containers/app'

import store from './store'

import React from 'react'
import ReactDOM from 'react-dom'
// import {hot} from 'react-hot-loader/root'
import {Provider} from 'react-redux'

import '../public/css/app.css'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'

// const Root = hot(() => (
//   <>
//     <App />
//   </>
// ))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

module.hot.accept()

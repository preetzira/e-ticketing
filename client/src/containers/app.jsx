import ErrorBoundary from './errorboundary'

import {AdminRoutes, UserRoutes} from './routes'

import {LOGIN_ADMIN} from '../store/actions/admin_actions'
import {LOGIN_USER} from '../store/actions/user_actions'
import {SET_USER_TYPE, IS_LOADING} from '../store/reducers'

import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import './app.css'

const Home = connect((state) => ({...state}))(
  ({dispatch, history, common: {isLoading}, ...props}) => {
    useEffect(() => {
      fetch('/v1/login-status')
        .then((res) => res.json())
        .then((data) => {
          if (data.userType === null) {
            return
          }
          if (data.userType === 0) {
            dispatch({
              type: LOGIN_USER,
            })
            dispatch({
              type: SET_USER_TYPE,
              payload: 'user',
            })
          }
          if (data.userType === 1) {
            dispatch({
              type: LOGIN_ADMIN,
            })
            dispatch({
              type: SET_USER_TYPE,
              payload: 'admin',
            })
          }
          dispatch({
            type: IS_LOADING,
            payload: false,
          })
        })
    }, [dispatch, history])
    if (props.location.pathname !== '/' && !isLoading) {
      return <Redirect to="/" />
    }
    if (isLoading) {
      return <>Loading...</>
    }
    return (
      <div className="center">
        <h4>Who are you?</h4>
        <button
          style={{margin: '0 10px'}}
          className="waves-effect orange darken-4 waves-light btn-large"
          onClick={() =>
            dispatch({
              type: SET_USER_TYPE,
              payload: 'admin',
            })
          }
        >
          Admin
        </button>
        <button
          style={{margin: '0 10px'}}
          className="waves-effect waves-light btn-large"
          onClick={() =>
            dispatch({
              type: SET_USER_TYPE,
              payload: 'user',
            })
          }
        >
          User
        </button>
      </div>
    )
  }
)

const App = (props) => {
  return (
    <ErrorBoundary>
      <Router>
        <Switch>
          {!props.userType && <Route path="/" component={Home} />}
          {props.userType === 'admin' && (
            <Route path="/" component={AdminRoutes} />
          )}
          {props.userType === 'user' && (
            <Route path="/" component={UserRoutes} />
          )}
          <Redirect to="/" />
        </Switch>
      </Router>
    </ErrorBoundary>
  )
}

export default connect((state) => ({userType: state.common.userType}))(App)

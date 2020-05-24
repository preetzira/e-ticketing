import RouteForm from './admin/routeform'
import Login from './common/login'
import Navbar from './common/Navbar'
import Routes from './common/routes'
import Signup from './common/signup'

import React from 'react'
import {Route} from 'react-router-dom'

const HelloWorld = (props) => (
  <div
    style={{
      position: 'fixed',
      top: '10px',
      left: 0,
      height: '40px',
      width: '100%',
    }}
  >
    {props.userType}
  </div>
)

const CommonRoutes = (props) => (
  <>
    <Route path="/" component={Navbar} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={Signup} />
  </>
)

export const AdminRoutes = (props) => (
  <>
    <CommonRoutes />
    <Route exact path="/new-route" component={RouteForm} />
    <Route exact path="/routes" component={Routes} />
  </>
)

export const UserRoutes = (props) => (
  <>
    <CommonRoutes />
    <Route exact path="/new-booking" component={HelloWorld} />
    <Route exact path="/bookings" component={HelloWorld} />
  </>
)

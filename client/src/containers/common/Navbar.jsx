import {logout as logoutAdmin} from '../../store/actions/admin_actions'
import {logout as logoutUser} from '../../store/actions/user_actions'
import {SET_USER_TYPE} from '../../store/reducers'

import React from 'react'

import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const UserLinks = (props) => (
  <>
    <li>
      <Link to="/new-booking">New Booking</Link>
    </li>
    <li>
      <Link to="/bookings">My Bookings</Link>
    </li>
  </>
)

const AdminLinks = (props) => (
  <>
    <li>
      <Link to="/new-route">New Routes</Link>
    </li>
    <li>
      <Link to="/routes">Routes</Link>
    </li>
  </>
)

const Navbar = ({dispatch, history, common: {userType}, ...props}) => (
  <nav>
    <div className="nav-wrapper">
      <Link to="/" className="brand-logo">
        e-ticket
      </Link>
      <ul className="right hide-on-med-and-down">
        {props[userType].isLoggedIn ? (
          <>
            {userType === 'admin' && <AdminLinks />}
            {userType === 'user' && <UserLinks />}
            <li>
              <Link
                to="#"
                onClick={() => {
                  userType === 'admin'
                    ? dispatch(logoutAdmin(history))
                    : dispatch(logoutUser(history))
                  dispatch({
                    type: SET_USER_TYPE,
                    payload: null,
                  })
                }}
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  </nav>
)

export default connect((state) => ({...state}))(Navbar)

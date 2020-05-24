import styles from './signup.css'

import {register as adminRegister} from '../../../store/actions/admin_actions'

import {register as userRegister} from '../../../store/actions/user_actions'

import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const Signup = (props) => (
  <form
    action="#"
    className="form-card"
    onSubmit={(e) => {
      e.preventDefault()
      if (props.userType === 'admin')
        props.dispatch(adminRegister(e, props.history))
      if (props.userType === 'user')
        props.dispatch(userRegister(e, props.history))
    }}
  >
    <h5 className="center">Sign up here</h5>
    <div className="input-field col s6">
      <input id="name" className="validate" type="text" required />
      <label htmlFor="name">Full name</label>
    </div>
    <div className="input-field col s6">
      <input
        id="email"
        className="validate"
        type="email"
        autoComplete="email"
        required
      />
      <label htmlFor="email">Email address</label>
    </div>
    <div className="input-field col s6">
      <input
        id="password"
        className="validate"
        type="password"
        autoComplete="new-password"
        required
      />
      <label htmlFor="password">Password</label>
    </div>
    <div className="col s6">
      <button
        className="btn waves-effect waves-light"
        type="submit"
        name="action"
      >
        Submit
      </button>
    </div>
    <br />
    Have an account <Link to="/login">Login here?</Link>
  </form>
)

const mapStateToProps = ({common}) => ({
  userType: common.userType,
})

export default connect(mapStateToProps)(Signup)

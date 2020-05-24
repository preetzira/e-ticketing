import {login as adminLogin} from '../../../store/actions/admin_actions'

import {login as userLogin} from '../../../store/actions/user_actions'

import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const Login = (props) => {
  return (
    <form
      action="#"
      className="form-card"
      onSubmit={(e) => {
        if (props.userType === 'admin')
          props.dispatch(adminLogin(e, props.history))
        if (props.userType === 'user')
          props.dispatch(userLogin(e, props.history))
      }}
    >
      <h5 className="center">Login up here</h5>
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
          type="password"
          className="validate"
          autoComplete="current-password"
          required
        />
        <label htmlFor="password">password</label>
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
      New user <Link to="/signup">Signup here?</Link>
    </form>
  )
}

const mapStateToProps = ({common}) => ({
  userType: common.userType,
})

export default connect(mapStateToProps)(Login)

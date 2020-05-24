import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import './login.css'

export default Logout = (props) => (
  <Link to='/' onClick={props.dispatch({
    type:`LOGOUT`
  })}>Logout</Link>
)

export default connect(state=>state)(Logout)
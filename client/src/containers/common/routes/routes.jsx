import {fetchRoutes} from '../../../store/actions/admin_actions'

import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class Routes extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.dispatch(fetchRoutes())
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.routes.length !== state.routes.length) {
      return {
        ...state,
        routes: props.routes,
      }
    }
    return null
  }

  state = {
    routes: [],
  }

  render() {
    return (
      <>
        <ul>
          {this.state.routes.map((route) => (
            <>
              <li>From {route.from}</li>
              <li>To {route.to}</li>
              <li>
                train:{' '}
                {JSON.stringify(route.train, [
                  'name',
                  'running_days',
                  'available_classes',
                ])}
              </li>
              <li>
                pricing:{' '}
                {JSON.stringify(route.train, (key, value) => {
                  if (key === 'train') return null
                  return value
                })}
              </li>
            </>
          ))}
        </ul>
        <br />
        <Link to="/">back</Link>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  routes: state[state.common.userType].routes,
})

export default connect(mapStateToProps)(Routes)

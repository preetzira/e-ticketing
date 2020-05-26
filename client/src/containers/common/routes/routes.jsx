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
    console.log({props, state})
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

    return this.state.routes.length ? (
      <div className="container" style={{marginTop:"20px"}}>
        <ul>
          {this.state.routes.map((route) => (
            <>
              <li>From {route.from}</li>
              <li>To {route.to}</li>
              {/* <li>
                trains:{' '}
                {JSON.stringify(route.trains, [
                  'name',
                  'running_days',
                  'available_classes',
                ])}
              </li> */}
              <li>
                pricing:{' '}
                {JSON.stringify(route.pricing, (key, value) => {
                  if (key === '_id') {
                    return null
                  }
                  return value
                })}
              </li>
            </>
          ))}
        </ul>
        <br />
        <Link className="waves-effect blue darken-4 waves-light btn-large" to="/">back</Link>
      </div>
    ) : 'Loading'
  }
}

const mapStateToProps = (state) => (console.error(state),{
  routes: state[state.common.userType].routes,
})

export default connect(mapStateToProps)(Routes)

export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const FETCH_TRAINS = 'FETCH_TRAINS'
export const FETCH_ROUTES = 'FETCH_ROUTES'
export const CANCEL_BOOKING = 'CANCEL_BOOKING'
export const CREATE_BOOKING = 'CREATE_BOOKING'
import {SET_USER_TYPE} from '../reducers'

export const loginUser = () => (dispatch) =>
  dispatch({
    type: LOGIN_USER,
  })

export const register = (e, history) => {
  e.preventDefault()
  const event = e
  const name = event.target[0].value
  const email = event.target[1].value
  const password = event.target[2].value
  return (dispatch) => {
    fetch('/v1/user/register', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({name, email, password}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (checkForErrors(data)) {
          alert(JSON.stringify(data))
          return
        }
        dispatch(loginUser())
        history.push('/')
      })
  }
}

export const login = (e, history) => {
  e.preventDefault()
  const event = e
  const email = event.target[0].value
  const password = event.target[1].value
  return (dispatch) => {
    fetch('/v1/user/login', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (checkForErrors(data)) {
          alert(JSON.stringify(data))
          return
        }
        dispatch(loginUser())
        history.push('/')
      })
  }
}

export const logout = (history) => {
  return (dispatch) => {
    fetch('/v1/logout', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: LOGOUT_USER,
        })
        dispatch({
          type: SET_USER_TYPE,
          payload: null,
        })
        history.push('/')
      })
  }
}

export const createRoute = (data, history) => {
  return (dispatch) => {
    fetch(`/v1/routes/create`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({...data}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
          alert(JSON.stringify(data))
          return
        }
        history.push('/routes')
      })
  }
}

export const updateRoute = (data, history) => {
  return (dispatch) => {
    fetch(`/v1/routes/update`, {
      method: 'put',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({...data}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
          alert(JSON.stringify(data))
          return
        }
        dispatch({
          type: LOGIN_USER,
          payload: data,
        })
        history.push('/routes')
      })
  }
}

export const fetchRoutes = ({from, to}) => {
  const url = new URL('/v1/routes')
  from && url.searchParams.append('from', from)
  to && url.searchParams.append('to', to)
  return (dispatch) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: FETCH_ROUTES,
          payload: data,
        })
      })
  }
}

export const fetchTrains = () => {
  return (dispatch) => {
    fetch('/v1/trains')
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: FETCH_TRAINS,
          payload: data,
        })
      })
  }
}

function checkForErrors(obj) {
  return (
    Object.prototype.hasOwnProperty.call(obj, 'error') ||
    Object.prototype.hasOwnProperty.call(obj, 'errors')
  )
}

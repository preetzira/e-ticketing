import {SET_USER_TYPE} from '../reducers'

export const EDIT_ROUTE = 'EDIT_ROUTE'
export const FETCH_TRAINS = 'FETCH_TRAINS'
export const FETCH_CITIES = 'FETCH_CITIES'
export const FETCH_ROUTES = 'FETCH_ROUTES'
export const CREATE_ROUTE = 'CREATE_ROUTE'
export const LOGIN_ADMIN = 'LOGIN_ADMIN'
export const LOGOUT_ADMIN = 'LOGOUT_ADMIN'

export const loginAdmin = () => (dispatch) =>
  dispatch({
    type: LOGIN_ADMIN,
  })

export const register = (e, history) => {
  e.preventDefault()
  const event = e
  const name = event.target[0].value
  const email = event.target[1].value
  const password = event.target[2].value
  return (dispatch) => {
    fetch('/v1/admin/register', {
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
        dispatch(loginAdmin())
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
    fetch('/v1/admin/login', {
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
        dispatch(loginAdmin())
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
          type: LOGOUT_ADMIN,
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
        if (checkForErrors(data)) {
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
          type: LOGIN_ADMIN,
          payload: data,
        })
        history.push('/routes')
      })
  }
}

export const fetchRoutes = ({from = null, to = null} = {}) => {
  const url = `/v1/routes/?from=${from}&to=${to}`
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

export const fetchCities = () => {
  return (dispatch) => {
    fetch('/v1/cities')
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: FETCH_CITIES,
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

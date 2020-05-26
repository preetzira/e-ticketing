import {
  LOGIN_ADMIN,
  LOGOUT_ADMIN,
  CREATE_ROUTE,
  EDIT_ROUTE,
  FETCH_TRAINS,
  FETCH_CITIES,
  FETCH_ROUTES,
} from '../actions/admin_actions'

const state = {isLoggedIn: false, cities: [], routes: [], trains: []}

export default function (initialState = state, action) {
  switch (action.type) {
    case LOGIN_ADMIN:
      return {...initialState, isLoggedIn: true}
    case LOGOUT_ADMIN:
      return {...initialState, isLoggedIn: false}
    case FETCH_CITIES:
      return {
        ...initialState,
        cities: action.payload,
      }
    case FETCH_TRAINS:
      return {
        ...initialState,
        trains: action.payload,
      }
    case FETCH_ROUTES:
      return {
        ...initialState,
        routes: action.payload,
      }
    default:
      return initialState
  }
}

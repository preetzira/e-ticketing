import {LOGIN_USER, LOGOUT_USER} from '../actions/user_actions'

export default function (initialState = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {...initialState, isLoggedIn: true}
    case LOGOUT_USER:
      return {...initialState, isLoggedIn: false}
    default:
      return initialState
  }
}

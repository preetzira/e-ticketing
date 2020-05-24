import adminReducers from './admin_reducers'
import userReducers from './user_reducers'

import {combineReducers} from 'redux'

export const SET_USER_TYPE = 'SET_USER_TYPE'
export const IS_LOADING = 'IS_LOADING'

const commonReducer = function (
  initialState = {isLoading: true, userType: null},
  action
) {
  switch (action.type) {
    case SET_USER_TYPE:
      return {...initialState, userType: action.payload}
    case IS_LOADING:
      return {...initialState, isLoading: action.payload}
    default:
      return initialState
  }
}

export default combineReducers({
  user: userReducers,
  admin: adminReducers,
  common: commonReducer,
})

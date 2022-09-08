import {TRIGGER_LOGIN} from '../actions/actionTypes'

const initialState = {
  loginObj: {
    loading: false,
    data: [],
    error: null,
  },

  logoutObj: {
    loading: false,
    data: [],
    error: null,
  },
  registerObj: {
    loading: false,
    data: [],
    error: null,
  },

  forgetPassword: {
    loading: false,
    data: null,
    error: null,
  },

  changePassword: {
    loading: false,
    data: null,
    error: null,
  },

  profileObj: {
    loading: false,
    data: [],
    error: null,
  },
}

const authReducer = function (state = initialState, action) {
  switch (action.type) {
    case TRIGGER_LOGIN:
      return {
        ...state,
        loginObj: {
          loading: true,
          data: [],
          error: null,
        },
      }
    default:
      return state
  }
}

export default authReducer

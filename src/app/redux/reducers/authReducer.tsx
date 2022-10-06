import {TRIGGER_LOGIN, TRIGGER_OTP} from '../actions/actionTypes'

const initialState = {
  // loginObj: {
  //   loading: false,
  //   data: [],
  //   error: null,
  // },

  // logoutObj: {
  //   loading: false,
  //   data: [],
  //   error: null,
  // },
  // registerObj: {
  //   loading: false,
  //   data: [],
  //   error: null,
  // },

  // forgetPassword: {
  //   loading: false,
  //   data: null,
  //   error: null,
  // },

  // changePassword: {
  //   loading: false,
  //   data: null,
  //   error: null,
  // },

  // profileObj: {
  //   loading: false,
  //   data: [],
  //   error: null,
  // },

  otpDetails: {},
}

const authReducer = function (state = initialState, action) {
  switch (action.type) {
    // case TRIGGER_LOGIN:
    //   return {
    //     ...state,
    //     loginObj: {
    //       loading: true,
    //       data: [],
    //       error: null,
    //     },
    //   }

    case TRIGGER_OTP:
      return {
        ...state,
        otpDetails: action.otpDetails,
      }
    default:
      return state
  }
}

export default authReducer

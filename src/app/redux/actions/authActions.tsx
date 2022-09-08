import {makeAPICall} from '../../utils'
import config from '../../utils/config'
import {
  TRIGGER_LOGIN,
  TRIGGER_LOGIN_SUCCESS,
  TRIGGER_LOGIN_FAILED,
  TRIGGER_LOGOUT,
  TRIGGER_LOGOUT_SUCCESS,
  TRIGGER_LOGOUT_FAILED,
  TRIGGER_REGISTER,
  TRIGGER_REGISTER_SUCCESS,
  TRIGGER_REGISTER_FAILED,
  TRIGGER_SET_PASSWORD,
  TRIGGER_SET_PASSWORD_SUCCESS,
  TRIGGER_SET_PASSWORD_FAILED,
  TRIGGER_FORGET_PASSWORD,
  TRIGGER_FORGET_PASSWORD_SUCCESS,
  TRIGGER_FORGET_PASSWORD_FAILED,
  TRIGGER_CHANGE_PASSWORD,
  TRIGGER_CHANGE_PASSWORD_SUCCESS,
  TRIGGER_CHANGE_PASSWORD_FAILED,
} from './actionTypes'

export function triggerAuthLogin(obj, callback) {
console.log('🚀 ~ file: authActions.tsx ~ line 25 ~ triggerAuthLogin ~ obj', config.apiBasePath)

  return (dispatch) => {
    const params = {
      url: `${config.apiBasePath}${config.urlLogin}`,
      dispatch,
      defaultAction: TRIGGER_LOGIN,
      successAction: TRIGGER_LOGIN_SUCCESS,
      failedAction: TRIGGER_LOGIN_FAILED,
      type: 'POST',
      headers: {},
      params: obj,
      callback,
    }
    makeAPICall(params)
  }
}

export function triggerAuthRegister(obj, callback) {
  return (dispatch) => {
    const params = {
      url: `${config.apiBasePath}${config.urlRegister}`,
      dispatch,
      defaultAction: TRIGGER_REGISTER,
      successAction: TRIGGER_REGISTER_SUCCESS,
      failedAction: TRIGGER_REGISTER_FAILED,
      type: 'POST',
      headers: {},
      params: obj,
      callback,
    }
    makeAPICall(params)
  }
}

export function triggerAuthSetPassword(obj, callback) {
  return (dispatch) => {
    const params = {
      url: `${config.apiBasePath}${config.urlResetPassword}`,
      dispatch,
      defaultAction: TRIGGER_SET_PASSWORD,
      successAction: TRIGGER_SET_PASSWORD_SUCCESS,
      failedAction: TRIGGER_SET_PASSWORD_FAILED,
      type: 'POST',
      headers: {},
      params: obj,
      callback,
    }
    makeAPICall(params)
  }
}

export function triggerForgotPassword(obj, callback) {
  return (dispatch) => {
    const params = {
      url: `${config.apiBasePath}${config.urlForgetPassword}`,
      dispatch,
      defaultAction: TRIGGER_FORGET_PASSWORD,
      successAction: TRIGGER_FORGET_PASSWORD_SUCCESS,
      failedAction: TRIGGER_FORGET_PASSWORD_FAILED,
      type: 'POST',
      headers: {},
      params: obj,
      callback,
    }
    makeAPICall(params)
  }
}

export function triggerResetPassword(obj, callback) {
  // console.log(obj)
  return (dispatch) => {
    const params = {
      url: `${config.apiBasePath}${config.urlResetPassword}/${obj.id}`,
      dispatch,
      defaultAction: TRIGGER_CHANGE_PASSWORD,
      successAction: TRIGGER_CHANGE_PASSWORD_SUCCESS,
      failedAction: TRIGGER_CHANGE_PASSWORD_FAILED,
      type: 'POST',
      headers: {},
      params: obj.forgotPassword,
      callback,
    }
    makeAPICall(params)
  }
}

export function triggerLogout(obj, callback) {
  // logout();
  return (dispatch) => {
    const params = {
      url: `${config.apiBasePath}${config.urlLogout}`,
      dispatch,
      defaultAction: TRIGGER_LOGOUT,
      successAction: TRIGGER_LOGOUT_SUCCESS,
      failedAction: TRIGGER_LOGOUT_FAILED,
      type: 'POST',
      headers: {},
      params: obj,
      callback,
    }
    makeAPICall(params)
  }
}

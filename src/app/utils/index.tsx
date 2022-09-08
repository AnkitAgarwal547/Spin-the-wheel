import axios from 'axios'
import {TRIGGER_LOGOUT_SUCCESS} from '../redux/actions/actionTypes'

export const makeAPICall = async (apiData) => {
  // let history = useHistory();
  let {
    url,
    dispatch,
    defaultAction,
    successAction,
    failedAction,
    type,
    callback,
    errCallback,
    callbackData,
    extraData,
    noToken,
    params = {},
  } = apiData
  console.log('🚀 ~ file: index.tsx ~ line 20 ~ makeAPICall ~ apiData', apiData)

  if (!url || url.indexOf('http://') === 1) {
    dispatch({
      type: null,
      payload: null,
    })
    return Promise.reject()
  }

  let apiObj = {
    method: type ? type : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
    data: {},
    timeOut: 0,
    url: '',
  }

  if (defaultAction) {
    dispatch({
      type: defaultAction,
      payload: null,
    })
  }

  if (type !== 'GET') {
    apiObj.data = JSON.stringify(params)
    apiObj.method = 'POST'
    apiObj.timeOut = 2
  }

  if (noToken) {
  } else {
    apiObj.headers = {
      ...apiObj.headers,
      Authorization: 'Bearer ' + window.localStorage.TOKEN_KEY,
    }
  }

  apiObj.url = url
  return await axios(apiObj)
    .then((response) => {
      try {
        response = response.data
        // if (response.status == 200) { str.includes("world")
        if (response) {
          if (apiObj.url.includes('login')) {
            global.sessionTime = new Date()
          }
          if (successAction) {
            dispatch({
              type: successAction,
              payload: response,
              data: params,
              params,
              callbackData,
              extraData,
            })
          }
          if (callback) {
            callback(response, params)
          }
        } else {
          if (failedAction) {
            dispatch({
              type: failedAction,
              payload: [],
              data: params,
              error: response,
            })
          }
          if (errCallback) {
            errCallback(response, params)
          }
        }
      } catch (e) {
        if (failedAction) {
          dispatch({
            type: failedAction,
            payload: [],
            data: params,
            error: e,
          })
        }
      }
    })
    .catch((error) => {
      console.log(failedAction)
      console.log(error)
      if (error.response) {
        console.log(error.response.data) // => the response payload
        if (failedAction) {
          console.log(error.response.data.error)
          if (error.response.data.error === 'Unauthenticated.') {
            console.log(error.response.data.error)
            dispatch({
              type: TRIGGER_LOGOUT_SUCCESS,
              logoutObj: {loading: false, data: [], error: null},
            })
            logout()
          }
          console.log(error)
          dispatch({
            type: failedAction,
            payload: [],
            data: params,
            error: error.response.data,
          })
        }
      }
    })
}

export const login = (token) => {
  if (token) {
    localStorage.setItem('TOKEN_KEY', token)
  }
}

export const rememberUser = (loginObj) => {
  if (loginObj) {
    localStorage.setItem('remember-user', JSON.stringify(loginObj))
  }
}

export const logout = () => {
  localStorage.removeItem('TOKEN_KEY')
}

export const isLogin = () => {
  if (localStorage.getItem('TOKEN_KEY')) {
    return true
  }
  return false
}

export const validatePassword = (txt) => {
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  if (txt.match(passwordRegex)) {
    return true
  }
  return false
}

export const validateEmail = (email) => {
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (email.match(mailformat)) {
    return true
  }
  return false
}

export function titleCase(str) {
  return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase())
}

const statusList = [
  {
    number: 1,
    status: 'Pending',
    icon: 'fa-hourglass-start ',
  },
  {
    number: 2,
    status: 'Failed',
    icon: 'fa-ban',
    color: 'red',
  },
  {
    number: 3,
    status: 'Processing',
    icon: 'fa-cogs',
    color: '#07c9ab',
  },
  {
    number: 4,
    status: 'Completed',
    icon: 'fa-check',
  },
  {
    number: 5,
    status: 'On-Hold',
    icon: 'fa-pause-circle',
  },
  {
    number: 6,
    status: 'Cancelled',
    icon: 'fa-times-circle',
    color: 'red',
  },
  {
    number: 7,
    status: 'Refunded',
    icon: 'fa-dollar-sign',
  },
]

export function getStatus(status) {
  let index = statusList.findIndex((item) => {
    return item.number === status
  })

  return statusList[index]
}

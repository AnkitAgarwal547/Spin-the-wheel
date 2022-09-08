import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {TRIGGER_LOGOUT_SUCCESS} from '../redux/actions/actionTypes'
import {triggerAuthLogin, triggerLogout} from '../redux/actions/authActions'
import {useAppDispatch} from '../redux/hooks/hooks'

export default function useAuthHook() {
  const dispatch = useAppDispatch()
  const {logoutObj} = useSelector((state: any) => state.authReducer)

  const notify = (msg) => {
    // toast.success(msg, {
    //   toastId: 'toastMsg',
    //   autoClose: 2000,
    //   hideProgressBar: true,
    // })
  }

  useEffect(() => {
    if (logoutObj?.error) {
      clearToken()
    }
  }, [logoutObj])

  function login(email, password, setLoading) {
    setLoading(true)
    return dispatch(
      triggerAuthLogin(
        {
          email: email,
          password: password,
        },
        (resp) => {
          console.log('🚀 ~ file: useAuthHooks.tsx ~ line 34 ~ login ~ resp', resp)
          if (resp?.code === 200) {
            setLoading(false)
          }
        }
      )
    )
  }

  function logout(close) {
    // return dispatch(
    //   triggerLogout({}, (resp) => {
    //     if (resp) {
    //       notify('Logout successful!')
    //       clearToken()
    //       close()
    //     }
    //   })
    // )
  }

  function clearToken() {}

  return [login, logout]
}

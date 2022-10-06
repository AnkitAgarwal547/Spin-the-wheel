/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes, useLocation} from 'react-router-dom'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import './AuthPage.scss'

const AuthLayout = () => {
  const location = useLocation()

  useEffect(() => {
    document.body.classList.add('bg-body')
    return () => {
      document.body.classList.remove('bg-body')
    }
  }, [])

  return (
    <>
      {location.pathname === '/auth/login' ? (
        <div className='row p-0 m-0 align-items-center h-100'>
          <div className='col-xxl-6 col-lg-6 col-md-6  text-center logo-img'>
            <img
              className='img-responsive'
              src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/logo/logo.png'
            />
          </div>
          <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6'>
            <Outlet />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  )
}

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}

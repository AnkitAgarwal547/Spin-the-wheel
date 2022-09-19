/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes, useLocation} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
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
            <img src='https://live25east.com/wp-content/uploads/2015/10/placeholder-circle-300x300.png' />
          </div>
          <div className='col-xxl-6 col-lg-4 col-md-4'>
            <Outlet />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
    // <div
    //   className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
    //   // style={{
    //   //   backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
    //   // }}
    // >
    //   {/* begin::Content */}
    //   <div className='p-10 pb-lg-20'>
    //     {/* begin::Logo */}
    //     {/* <a href='#' className='mb-12'>
    //       <img alt='Logo' src={toAbsoluteUrl('/media/logos/default.svg')} className='h-45px' />
    //     </a> */}
    //     {/* end::Logo */}
    //     {/* begin::Wrapper */}
    //     <div className='bg-body rounded p-10 p-lg-15 mx-auto'>
    //       {location.pathname === '/auth' ? (
    //         <div className='row'>
    //           <div className='col-xxl-6 col-lg-6 col-md-6'>fhj</div>
    //           <div className='col-xxl-6 col-lg-6 col-md-6'>
    //             <Outlet />
    //           </div>
    //         </div>
    //       ) : (
    //         <Outlet />
    //       )}
    //     </div>
    //     {/* end::Wrapper */}
    //   </div>

    // </div>
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

/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'
import {getUserType} from '../modules/auth/core/_requests'
import VerifyMobile from '../../_metronic/layout/components/user/auth/VerifyMobile'
import VerifyOTP from '../../_metronic/layout/components/user/auth/VerifyOTP'
import UserCampaignWrapper from '../../_metronic/layout/components/user/campaigns/UserCampaignWrapper'
import UserDetails from '../../_metronic/layout/components/user/claim-prize/UserDetails'
import Terms from '../../_metronic/layout/components/user/terms/Terms'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  const {currentUser} = useAuth()
  const userType = getUserType()
  console.log('🚀 ~ file: AppRoutes.tsx ~ line 26 ~ userType', userType)
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {currentUser ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth/login' />} />
              <Route path='*' element={<Navigate to='/auth/forgot-password' />} />
            </>
          )}

          <Route path='/verify-mobile' element={<VerifyMobile />} />
          <Route path='/verify-otp' element={<VerifyOTP />} />
          <Route path='/campaign' element={<UserCampaignWrapper />} />
          <Route path='/user-details' element={<UserDetails />} />
          <Route path='/terms-and-conditions' element={<Terms />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}

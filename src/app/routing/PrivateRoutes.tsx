import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import CompaignWrapper from '../pages/campaign/CampaignWrapper'
import {NewCampaign} from '../pages/campaign/newCampaign/NewCampaign'
import ChangePassword from '../modules/auth/components/ChangePassword'
import QuestionnaireWrapper from '../modules/questionnaire/QuestionnaireWrapper'
import {CampaignDetailsWrapper} from '../pages/campaign/campaignDetails/CampaignDetailsWrapper'
import VerifyMobile from '../../_metronic/layout/components/user/auth/VerifyMobile'
import VerifyOTP from '../../_metronic/layout/components/user/auth/VerifyOTP'
import UserCampaignWrapper from '../../_metronic/layout/components/user/campaigns/UserCampaignWrapper'
import {getUserType} from '../modules/auth/core/_requests'
import Question from '../../_metronic/layout/components/user/question/Question'
import SmsTerms from '../../_metronic/layout/components/user/sms-terms/SmsTerms'

const role = getUserType()
const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='/dashboard' element={<DashboardWrapper />} />
        <Route path='/campaigns' element={<CompaignWrapper />} />
        <Route path='/campaign-details/:id' element={<CampaignDetailsWrapper />} />
        <Route path='/campaign/:type' element={<CampaignDetailsWrapper />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/new-campaign' element={<NewCampaign />} />
        <Route path='/edit-campaign/:id' element={<NewCampaign />} />
        <Route path='/questionnaire' element={<QuestionnaireWrapper />} />
        {/* Lazy Modules */}

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
      <Route>
        <Route path='/verify-mobile' element={<VerifyMobile />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/campaign' element={<UserCampaignWrapper />} />
        <Route path='/question' element={<Question />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}

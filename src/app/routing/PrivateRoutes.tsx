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
import { CampaignDetailsWrapper } from '../pages/campaign/campaignDetails/CampaignDetailsWrapper'

const PrivateRoutes = () => {
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='campaign' element={<CompaignWrapper />} />
        <Route path='campaign/:id' element={<CampaignDetailsWrapper />} />
        <Route path='change-password' element={<ChangePassword />} />
        <Route path='new-campaign' element={<NewCampaign />} />
        <Route path='questionnaire' element={<QuestionnaireWrapper />} />
        {/* Lazy Modules */}

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
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

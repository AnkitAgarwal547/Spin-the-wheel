import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {PersistGate} from 'redux-persist/integration/react'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import {injectStyle} from 'react-toastify/dist/inject-style'
import 'react-datepicker/dist/react-datepicker.css'

const App = () => {
  injectStyle()

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <AuthInit>
            <Outlet />
            <MasterInit />
          </AuthInit>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}

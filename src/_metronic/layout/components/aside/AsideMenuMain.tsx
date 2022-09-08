/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {useAuth} from '../../../../app/modules/auth'
import {AsideMenuItem} from './AsideMenuItem'
import {useLocation} from 'react-router-dom'

export function AsideMenuMain() {
  const intl = useIntl()
  const {logout} = useAuth()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/dashboard/white_dashboard.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='fa-home'
        activeIcon='/media/icons/dashboard/black_dashboard.svg'
      />

      <AsideMenuItem
        to='/campaigns'
        activeIcon='/media/icons/campaign/black_campaigns.svg'
        title='Campaign'
        fontIcon='fa-bullhorn'
        icon='/media/icons/campaign/white_campaigns.svg'
      />

      <AsideMenuItem
        to='questionnaire'
        icon='/media/icons/questionnaire/white_questionnaire.svg'
        title='Questionnaire'
        fontIcon='fa-file'
        activeIcon='/media/icons/questionnaire/black_questionnaire.svg'
      />
      <AsideMenuItem
        to='/change-password'
        activeIcon='/media/icons/setting/black_settings.svg'
        title='Settings'
        fontIcon='fa-cog'
        icon='/media/icons/setting/white_settings.svg'
      />

      <AsideMenuItem
        icon='/media/icons/logout/white_logout.svg'
        to=''
        title='Sign Out'
        fontIcon='bi-box-arrow-right'
        request={logout}
        activeIcon='/media/icons/setting/black_logout.svg'
      />
    </>
  )
}

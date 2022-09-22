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
        icon='/media/icons/white_dashboard.png'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='fa-home'
        activeIcon='/media/icons/black_dashboard.png'
        className='svg-icon-2'
      />

      <AsideMenuItem
        to='/campaigns'
        activeIcon='/media/icons/black_campaign.png'
        title='Campaign'
        fontIcon='fa-bullhorn'
        icon='/media/icons/white_campaign.png'
        className='svg-icon-2'
      />

      <AsideMenuItem
        to='/questionnaire'
        icon='/media/icons/white_questionnaire.png'
        title='Questionnaire'
        fontIcon='fa-file'
        activeIcon='/media/icons/black_questionnaire.png'
        className='svg-icon-2'
      />
      <AsideMenuItem
        to='/change-password'
        activeIcon='/media/icons/black_settings.png'
        title='Settings'
        fontIcon='fa-cog'
        icon='/media/icons/white_setting.png'
        className='svg-icon-2'
      />

      <AsideMenuItem
        icon='/media/icons/white_logout.png'
        to=''
        title='Sign Out'
        fontIcon='bi-box-arrow-right'
        request={logout}
        activeIcon='/media/icons/black_logout.png'
        className='svg-icon-2'
      />
    </>
  )
}

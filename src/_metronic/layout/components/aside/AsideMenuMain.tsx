/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {useAuth} from '../../../../app/modules/auth'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()
  const {logout} = useAuth()
  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='fa-home'
      />

      <AsideMenuItem
        to='/campaign'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Campaign'
        fontIcon='fa-bullhorn'
      />

      <AsideMenuItem
        to='questionnaire'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Questionnaire'
        fontIcon='fa-file'
      />
      <AsideMenuItem
        to='/change-password'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Settings'
        fontIcon='fa-cog'
      />

      <AsideMenuItem to='' title='Sign Out' fontIcon='bi-box-arrow-right' request={logout} />
    </>
  )
}

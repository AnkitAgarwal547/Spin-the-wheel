/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useRef} from 'react'
import {Link} from 'react-router-dom'
import clsx from 'clsx'
import {useLayout} from '../../core'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {AsideMenu} from './AsideMenu'
import './AsideMenu.scss'

type Props = {
  asideRef: any
  minimize: any
}

const AsideDefault: React.FC<Props> = ({asideRef, minimize}) => {
  const {config, classes} = useLayout()
  const {aside} = config

  return (
    <div
      id='kt_aside'
      className={clsx('aside bg-dark', classes.aside.join(' '))}
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_ mobile_toggle'
      ref={asideRef}
    >
      {/* begin::Brand */}
      <div className='aside-logo bg-dark mt-2' id='kt_aside_logo'>
        {/* begin::Logo */}
        {aside.theme === 'dark' && (
          <>
            <Link to='/dashboard'>
              <img
                alt='Logo'
                className='h-35px logo mr-2'
                src='https://live25east.com/wp-content/uploads/2015/10/placeholder-circle-300x300.png'
              />
            </Link>
            <h5 className='aside-company-name text-light ml-2 mb-0'>Company Name</h5>
          </>
        )}
        {aside.theme === 'light' && (
          <Link to='/dashboard'>
            <img
              alt='Logo'
              className='h-25px logo'
              src='https://live25east.com/wp-content/uploads/2015/10/placeholder-circle-300x300.png'
            />
            <div className='aside-company-name'>Company Name</div>
          </Link>
        )}
      </div>
      {/* end::Brand */}

      {/* begin::Aside menu */}
      <div className='aside-menu flex-column-fluid'>
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
      {/* end::Aside menu */}
    </div>
  )
}

export {AsideDefault}

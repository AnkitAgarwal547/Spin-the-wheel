/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useRef} from 'react'
import {Link} from 'react-router-dom'
import clsx from 'clsx'
import {useLayout} from '../../core'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {AsideMenu} from './AsideMenu'
import './AsideMenu.scss'

const AsideDefault: FC = () => {
  const {config, classes} = useLayout()
  const asideRef = useRef<HTMLDivElement | null>(null)
  const {aside} = config

  console.log('00', aside)

  const minimize = () => {
    asideRef.current?.classList.add('animating')
    setTimeout(() => {
      asideRef.current?.classList.remove('animating')
    }, 300)
  }

  return (
    <div
      id='kt_aside'
      className={clsx('aside', classes.aside.join(' '))}
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_mobile_toggle'
      ref={asideRef}
    >
      {/* begin::Brand */}
      <div className='aside-logo ' id='kt_aside_logo'>
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
            <h5 className='text-light ml-2 mb-0'>Company Name</h5>
          </>
        )}
        {aside.theme === 'light' && (
          <Link to='/dashboard'>
            <img
              alt='Logo'
              className='h-25px logo'
              src='https://live25east.com/wp-content/uploads/2015/10/placeholder-circle-300x300.png'
            />
            Company Name
          </Link>
        )}
        {/* end::Logo */}

        {/* begin::Aside toggler */}
        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
            onClick={minimize}
          >
            <KTSVG
              path={'/media/icons/duotune/arrows/arr080.svg'}
              className={'svg-icon-1 rotate-180'}
            />
          </div>
        )}
        {/* end::Aside toggler */}
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

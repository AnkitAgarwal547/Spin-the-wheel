/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useLayout} from '../core'

const Footer: FC = () => {
  const {classes} = useLayout()
  return (
    <div className='footer py-4 d-flex flex-lg-column' id='kt_footer'>
      {/* begin::Container */}
      <div
        className={`${classes.footerContainer} d-flex flex-column flex-md-row align-items-center justify-content-center`}
      >
        {/* begin::Copyright */}
        <div className='text-dark order-2 order-md-1'>
          <span className='text-muted me-2'>
            <span className='fw-bold'>2022</span> <span style={{fontWeight: '900'}}>&copy;</span>
          </span>
          <a href='#' className='text-gray-800 text-hover-primary'>
            Powered By Fedicoms
          </a>
        </div>
        {/* end::Copyright */}

        {/* begin::Nav */}

        {/* end::Nav */}
      </div>
      {/* end::Container */}
    </div>
  )
}

export {Footer}

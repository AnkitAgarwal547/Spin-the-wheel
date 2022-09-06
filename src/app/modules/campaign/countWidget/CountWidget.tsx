/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import './CountWidget.css'

type Props = {
  className: string
}

const CountWidget: React.FC<Props> = ({className}) => {
  return (
    <div className='mt-10'>
      <div className='row'>
        <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-4 '>
          <div className='count-widget-block bg-dark rounded mr-auto'>
            <div>
              <h1 className='text-white'>300</h1>
              <small className='text-white'>Total Users</small>
            </div>
            <div className='d-flex flex-column'>
              <button className='btn btn-light btn-sm px-3 py-2'>View All</button>
            </div>
            {/* end::Text */}
          </div>
        </div>
        <div className='col-xxl-4  col-xl-4 col-md-4 col-sm-4'>
          <div className='count-widget-block bg-dark rounded m-auto'>
            {/* begin::Symbol */}
            <div>
              <h1 className='text-white'>300</h1>
              <small className='text-white'>Total Winners</small>
            </div>
            {/* end::Symbol */}
            {/* begin::Text */}
            <div className='d-flex flex-column'>
              <button className='btn btn-light btn-sm px-3 py-2'>View All</button>
            </div>
            {/* end::Text */}
          </div>
        </div>
        <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-4'>
          {/* begin::Item */}
          <div className='count-widget-block bg-dark rounded' style={{marginLeft: 'auto'}}>
            {/* begin::Symbol */}
            <div>
              <h1 className='text-white'>300</h1>
              <small className='text-white'>Total Users submitted details</small>
            </div>
            {/* end::Symbol */}
            {/* begin::Text */}
            <div className='d-flex flex-column'>
              <button className='btn btn-light btn-sm px-3 py-2'>View All</button>
            </div>
            {/* end::Text */}
          </div>
          {/* end::Item */}
          {/* begin::Item */}
        </div>
      </div>
    </div>
  )
}

export {CountWidget}

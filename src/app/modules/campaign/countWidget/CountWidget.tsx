/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {getTotalUsers} from '../../auth/core/_requests'
import './CountWidget.css'

type Props = {
  className: string
}

const CountWidget: React.FC<Props> = ({className}) => {
  const [counts, setCounts] = useState<any>({})

  useEffect(() => {
    getTotalUsers('stats=1')
      .then((resp) => {
        setCounts(resp?.data?.data)
      })
      .catch((err) => {})
  }, [])

  return (
    <div className='mt-10'>
      <div className='row'>
        <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-4 '>
          <div className='count-widget-block bg-primary rounded mr-auto'>
            <div>
              <h1 className='text-white'>{counts?.user_count}</h1>
              <small className='text-white'>Total Users</small>
            </div>
            <div className='d-flex flex-column'>
              <Link to='/campaign/totalUsers' className='btn btn-light btn-sm px-3 py-2'>
                View All
              </Link>
            </div>
            {/* end::Text */}
          </div>
        </div>
        <div className='col-xxl-4  col-xl-4 col-md-4 col-sm-4'>
          <div className='count-widget-block bg-danger rounded m-auto'>
            {/* begin::Symbol */}
            <div>
              <h1 className='text-white'>{counts?.winner_count}</h1>
              <small className='text-white'>Total Winners</small>
            </div>
            {/* end::Symbol */}
            {/* begin::Text */}
            <div className='d-flex flex-column'>
              <Link to='/campaign/totalWinners' className='btn btn-light btn-sm px-3 py-2'>
                View All
              </Link>
            </div>
            {/* end::Text */}
          </div>
        </div>
        <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-4'>
          {/* begin::Item */}
          <div className='count-widget-block bg-success rounded' style={{marginLeft: 'auto'}}>
            {/* begin::Symbol */}
            <div>
              <h1 className='text-white'>{counts?.submittedetail_count}</h1>
              <small className='text-white'>Total Users submitted details</small>
            </div>
            {/* end::Symbol */}
            {/* begin::Text */}
            <div className='d-flex flex-column'>
              <Link to='/campaign/totalUserSubmitted' className='btn btn-light btn-sm px-3 py-2'>
                View All
              </Link>
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

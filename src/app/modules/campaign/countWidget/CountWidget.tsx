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
          <Link to='/campaign/totalUsers'>
            <div className='count-widget-block bg-primary rounded mr-auto'>
              <div>
                <h1 className='text-white'>{counts?.user_count}</h1>
                <small className='text-white'>Total Users</small>
              </div>
              {/* <div className='d-flex flex-column'>
                View All
              </div> */}
              {/* end::Text */}
            </div>
          </Link>
        </div>
        <div className='col-xxl-4  col-xl-4 col-md-4 col-sm-4'>
          {/* <Link to='/campaign/totalWinners'> */}
          <div className='count-widget-block bg-danger rounded m-auto'>
            {/* begin::Symbol */}
            <div>
              <h1 className='text-white'>{counts?.winner_count}</h1>
              <small className='text-white'>Total Winners</small>
            </div>
            {/* end::Symbol */}
            {/* begin::Text */}
            {/* <div className='d-flex flex-column'>View All</div> */}
            {/* end::Text */}
          </div>
          {/* </Link> */}
        </div>
        <div className='col-xxl-4 col-xl-4 col-md-4 col-sm-4'>
          {/* begin::Item */}
          <Link to='/campaign/totalUserSubmitted'>
            <div className='count-widget-block bg-success rounded' style={{marginLeft: 'auto'}}>
              {/* begin::Symbol */}
              <div>
                <h1 className='text-white'>{counts?.submittedetail_count}</h1>
                <small className='text-white'>Total Users submitted details</small>
              </div>
              {/* end::Symbol */}
              {/* begin::Text */}
              {/* <div className='d-flex flex-column'>View All</div> */}
              {/* end::Text */}
            </div>
          </Link>
          {/* end::Item */}
          {/* begin::Item */}
        </div>
      </div>
    </div>
  )
}

export {CountWidget}

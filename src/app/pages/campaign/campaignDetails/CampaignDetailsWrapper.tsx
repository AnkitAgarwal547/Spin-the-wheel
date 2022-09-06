/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {Button} from 'react-bootstrap'
import {CampaignDetailsTable} from './CampaignDetailsTable'
import './CampaignDetailsWrapper.scss'
type Props = {
  className?: string
  showButtons?: boolean
}

const CampaignDetailsWrapper: React.FC<Props> = ({className, showButtons}) => {
  return (
    <div>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h2 className='my-5'>Tata AIG User Details</h2>
        <div className='d-flex flex-wrap my-2'>
          <a
            href='#'
            className='btn btn-dark btn-sm rounded-pill'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_create_project'
          >
            Export
          </a>
        </div>
      </div>
      <div>
        <div className='d-flex flex-wrap  mb-6 border px-4 pt-3 pb-1 campaign-details-sub-header'>
          <div className='px-4'>
            <div className='label'>Total Clicks On The Campaign</div>
            <div className='value'>100</div>
          </div>
          <div className='vr'></div>
          <div className='px-4'>
            <div className='label'>Total Attempts On The Campaign</div>
            <div className='value'>100</div>
          </div>
          <div className='vr'></div>
          <div className='px-4'>
            <div className='label'>Bumpur Winner Name</div>
            <div className='value'>Ravi</div>
          </div>
        </div>
      </div>
      <CampaignDetailsTable />
    </div>
  )
}

export {CampaignDetailsWrapper}

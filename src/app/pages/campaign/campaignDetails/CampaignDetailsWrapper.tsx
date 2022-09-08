/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import {useLocation, useParams} from 'react-router'
import {CampaignDetailsTable} from './CampaignDetailsTable'
import './CampaignDetailsWrapper.scss'
type Props = {
  className?: string
  showButtons?: boolean
}

const CampaignDetailsWrapper: React.FC<Props> = ({className, showButtons}) => {
  const {type} = useParams()
  const [bumperWinner, setBumperWinner] = useState(false)
  console.log('🚀 ~ file: CampaignDetailsWrapper.tsx ~ line 14 ~ location', type)

  return (
    <div>
      {!type && (
        <>
          <div className='d-flex flex-wrap flex-stack mb-6'>
            <div className='d-flex flex-wrap  align-items-center'>
              <h2 className='mb-0'>Tata AIG User Details</h2>
              <a
                href='#'
                className='btn btn-dark btn-sm bumper-btn'
                data-bs-toggle='modal'
                data-bs-target='#kt_modal_create_project'
                onClick={() => setBumperWinner(true)}
              >
                Generate Bumpur Winner
              </a>
            </div>
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
              {bumperWinner && (
                <>
                  <div className='vr'></div>
                  <div className='px-4'>
                    <div className='label'>Bumpur Winner Name</div>
                    <div className='value'>Ravi</div>
                  </div>
                  <div className='vr'></div>
                  <div className='px-4'>
                    <div className='label'>Avg Shortest Time Taken</div>
                    <div className='value'>6.6 Sec</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <CampaignDetailsTable />
    </div>
  )
}

export {CampaignDetailsWrapper}

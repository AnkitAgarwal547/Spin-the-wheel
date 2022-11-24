/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import {CSVLink} from 'react-csv'
import {useLocation, useParams} from 'react-router'
import {
  generateWinner,
  getCampaignClickedUsers,
  getCampaignUsers,
  getRequest,
  getTotalUsers,
} from '../../../modules/auth/core/_requests'
import Loader from '../../../shared/Loader'
import {CampaignDetailsTable} from './CampaignDetailsTable'
import './CampaignDetailsWrapper.scss'
import {useAppSelector} from '../../../redux/hooks/hooks'
import moment from 'moment'

type Props = {
  className?: string
  showButtons?: boolean
}

const CampaignDetailsWrapper: React.FC<Props> = ({className, showButtons}) => {
  const {type} = useParams()
  const [bumperWinnerDetails, setBumperWinnerDetails] = useState<any>()
  const [isBumperWinnerLoading, setBumperWinnerLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const {searchKey} = useAppSelector((state) => state.searchReducer)
  const [userList, setUserList] = useState([])
  const [details, setDetails] = useState<any>()
  const [error, setError] = useState(false)
  const location: any = useLocation()
  const [userWithClicks, setUsersWithClicks] = useState([])

  const {id} = useParams()

  useEffect(() => {
    if (id) {
      setIsLoadingDetails(true)
      getCampaignUsers(id)
        .then((resp) => {
          let data = resp?.data?.data?.users.map((item) => {
            return {
              ...item,
              created_at: new Date(item.created_at).toLocaleString(),
              modified_at: new Date(item.modified_at).toLocaleString(),
              game_played_at: new Date(item.game_played_at).toLocaleString(),
              answer_timetaken: String(new Date(item.answer_timetaken).toISOString().slice(11, 19)),
            }
          })
          setUserList(data)
          setDetails(resp?.data?.data?.stats)
          setIsLoadingDetails(false)
        })
        .catch((err) => {
          setIsLoadingDetails(false)
          setError(true)
        })

      getCampaignClickedUsers(id).then((resp) => {
        let data = resp?.data?.data.map((item) => {
          return {...item, created_at: new Date(item.created_at).toLocaleString()}
        })
        setUsersWithClicks(data)
      })
    }
  }, [id])

  useEffect(() => {
    if (type) {
      setIsLoadingDetails(true)
      getTotalUsers(
        type === 'totalWinners'
          ? 'winner=1'
          : type === 'totalUserSubmitted'
          ? 'submitteddetail=1'
          : ''
      )
        .then((resp) => {
          setUserList(resp?.data?.data)
          setDetails(resp?.data?.data?.stats)
          setIsLoadingDetails(false)
        })
        .catch((err) => {
          setIsLoadingDetails(false)
          setError(true)
        })
    }
  }, [type])

  const generateBumperWinner = () => {
    setBumperWinnerLoading(true)
    generateWinner(id)
      .then((resp) => {
        setBumperWinnerLoading(false)
        setBumperWinnerDetails(resp.data.data[0])
      })
      .catch(() => {
        setBumperWinnerLoading(false)
      })
  }

  const getTypeName = (type) => {
    let heading
    switch (type) {
      case 'totalUsers':
        heading = 'Total Users'
        break
      case 'totalWinners':
        heading = 'Total Winners'
        break
      case 'totalUserSubmitted':
        heading = 'Total Users submitted details'
    }

    return heading
  }

  return (
    <div className='campaign-details-wrapper'>
      {isLoadingDetails ? (
        <Loader className='center' />
      ) : (
        <>
          {!type && (
            <>
              <div className='d-flex flex-wrap flex-stack mb-6'>
                <div className='d-flex flex-wrap  align-items-center'>
                  <h2 className='mb-0'>{location.state}</h2>
                  {userList?.length !== 0 && (
                    <button
                      className='btn btn-primary btn-sm bumper-btn'
                      onClick={() => generateBumperWinner()}
                      disabled={isBumperWinnerLoading}
                    >
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Generate Bumper Winner
                        {isBumperWinnerLoading && (
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <div>
                <div className='d-flex flex-wrap  mb-6 border px-4 pt-3 pb-1 campaign-details-sub-header'>
                  <div className='px-4'>
                    <div className='label'>Total Clicks On The Campaign</div>
                    <div className='value text-dark'>
                      {' '}
                      <CSVLink
                        className='text-dark'
                        data={userWithClicks}
                        filename={`CampaignTotalClicksDetails${moment
                          .utc()
                          .format('DD-MM-YY')}.csv`}
                        target='_blank'
                      >
                        {details?.click_count || 0}
                      </CSVLink>
                    </div>
                  </div>
                  <div className='vr'></div>
                  <div className='px-4'>
                    <div className='label'>Total Attempts On The Campaign</div>
                    <div className='value'>
                      {' '}
                      <CSVLink
                        className='text-dark'
                        data={userList}
                        filename={`CampaignTotalAttemptsDetails${moment
                          .utc()
                          .format('DD-MM-YY')}.csv`}
                        target='_blank'
                      >
                        {details?.attempt_count || 0}
                      </CSVLink>
                    </div>
                  </div>
                  {bumperWinnerDetails && (
                    <>
                      <div className='vr'></div>
                      <div className='px-4'>
                        <div className='label'>Bumpur Winner Name</div>
                        <div className='value'>
                          {bumperWinnerDetails?.submitted_detail_name?.name}
                        </div>
                      </div>
                      <div className='vr'></div>
                      <div className='px-4'>
                        <div className='label'>Avg Shortest Time Taken</div>
                        <div className='value'>
                          {bumperWinnerDetails?.avg_timetaken}
                          Sec
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          {type && <h2 className='mb-5'>{getTypeName(type)}</h2>}

          <CampaignDetailsTable data={userList} error={error} />
        </>
      )}
    </div>
  )
}

export {CampaignDetailsWrapper}

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {CSVLink} from 'react-csv'
import {Link, useNavigate} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import PaginationWrappper from '../../../_metronic/layout/components/pagination/PaginationWrapper'
import {useAppSelector} from '../../redux/hooks/hooks'
import Loader from '../../shared/Loader'
import {deleteCampaignRequest, getCampaigns, getRequest} from '../auth/core/_requests'
import './CompaignTable.scss'
import {useAuth} from '../auth'
import _, {debounce} from 'lodash'
import {
  TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE,
  TRIGGER_SEARCH_KEYWORD,
} from '../../redux/actions/actionTypes'
import {useDispatch} from 'react-redux'
import moment from 'moment'

type Props = {
  className: string
  showButtons: boolean
}

export const typeOfCampaigns = {
  SPIN_THE_WHEEL: 'SPIN_THE_WHEEL',
  CHOOSE_THE_BOX: 'CHOOSE_THE_BOX',
  SCRATCH_THE_CARD: 'SCRATCH_CARD',
}

const CampaignTable: React.FC<Props> = ({className, showButtons}) => {
  const {searchKey} = useAppSelector((state) => state.searchReducer)
  const {campaignTableCurrentPage} = useAppSelector((state) => state.paginationReducer)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(campaignTableCurrentPage || 1)
  const [campaignsPerPage, setCampaignsPerPage] = useState(10)
  const indexOfLastCampaign = currentPage * campaignsPerPage
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage
  const [isLoading, setIsLoading] = useState(false)
  const currentCampaignsList = campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign)
  const {currentUser} = useAuth()
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const [currentData, setCurrentData] = useState(currentCampaignsList)
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser && currentUser.token) {
      getCampaignList()
    }
  }, [currentUser])

  const getCampaignList = () => {
    setIsLoading(true)
    setTimeout(() => {
      getCampaigns()
        .then((resp) => {
          setIsLoading(false)
          setCampaigns(resp.data.data)
        })
        .catch(() => {
          setIsLoading(false)
          setError(true)
        })
    }, 200)
  }

  const typeOfCampaign = (type) => {
    let label = ''
    switch (type) {
      case typeOfCampaigns.SPIN_THE_WHEEL:
        label = 'Spin The Wheel'
        break

      case typeOfCampaigns.SCRATCH_THE_CARD:
        label = 'Scratch the Card'
        break

      case typeOfCampaigns.CHOOSE_THE_BOX:
        label = 'Choose the Box'
        break

      default:
        break
    }

    return label
  }

  const deleteCampaign = (id) => {
    deleteCampaignRequest(id).then((resp) => {
      getCampaignList()
    })
  }

  useEffect(() => {
    if (searchKey !== '') {
      const timeout = setTimeout(() => {
        const filter = _.filter(campaigns, (user) => {
          let userObj = {company_name: user.company_name, title: user.title, type: user.type}
          return _.includes(_.lowerCase(JSON.stringify(_.values(userObj))), _.lowerCase(searchKey))
        })
        setCurrentData(filter)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [searchKey])

  useEffect(() => {
    if (searchKey === '' && currentCampaignsList.length) {
      setCurrentData(currentCampaignsList)
    }
  }, [currentCampaignsList])

  useEffect(() => {
    dispatch({
      type: TRIGGER_SEARCH_KEYWORD,
      searchKey: '',
    })
  }, [])

  const formatData = (campaigns) => {
    let data = campaigns.map((item) => {
      return {
        ...item,
        created_at: moment.utc(item.created_at).format('DD/MM/YYYY h:mm A'),
        start_date: moment.utc(item.start_date).format('DD/MM/YYYY h:mm A'),
        end_date: moment.utc(item.end_date).format('DD/MM/YYYY h:mm A'),
      }
    })
    return data
  }

  return (
    <div className={`campaign-table-wrapper ${className}`}>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h1 className='my-5'>Campaign Details</h1>
        {showButtons && (
          <div className='d-flex flex-wrap my-2'>
            <div className='me-4'>
              <CSVLink
                data={formatData(campaigns)}
                className='btn btn-outline-dark btn-sm rounded-pill'
                filename={`Campaigns${moment.utc().format('DD-MM-YY')}.csv`}
                target='_blank'
              >
                Export
              </CSVLink>
            </div>

            <Link to='/new-campaign' className='btn btn-primary btn-sm rounded-pill'>
              <KTSVG className='svg-icon-sm' path='/media/icons/plus.svg' />
              New Campaign
            </Link>
          </div>
        )}
      </div>

      <div className='py-3 campaign-table-outer'>
        {isLoading ? (
          <Loader size='1rem' />
        ) : (
          <div className='table-responsive'>
            <table className='table campaign-table table-row-dashed table-responsive table-row-gray-300 align-middle gs-0'>
              <thead className='bg-secondary rounded'>
                <tr className='fw-bold text-dark'>
                  <th className='min-w-100px text-center'>SR NO.</th>
                  <th className='min-w-100px'>COMPANY NAME</th>
                  <th className='min-w-120px text-center'>COMPAIGN TITLE</th>
                  <th className='min-w-100px text-center'>TYPE</th>
                  <th className='w-10 text-center'>URL</th>
                  <th className='min-w-100px text-center'>OR CODE</th>
                  <th className='min-w-100px text-center'>USER CLICKS</th>
                  <th className='min-w-100px text-center'>TOTAL ATTEMPTS</th>
                  <th className='min-w-150px text-center'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 && !error ? (
                  currentData.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td className='text-center'>
                          {(currentPage - 1) * campaignsPerPage + i + 1}
                        </td>
                        <td className='text-start'>{item.company_name} </td>
                        <td className='text-center'>{item.title}</td>
                        <td>{typeOfCampaign(item.type)}</td>
                        <td>
                          <div className='text-truncate text-primary' style={{width: '100px'}}>
                            {/* https://fedicoms.net  */}
                            {/* http://localhost:3011/campaigns */}
                            <a
                              style={{width: '100px'}}
                              target='_blank'
                              className='text-primary'
                              href={`https://fedicoms.net/verify-mobile?campaignId=${item._id}`}
                            >{`https://fedicoms.net/verify-mobile?campaignId=${item._id}`}</a>
                          </div>
                        </td>
                        <td className='text-center'>
                          <img alt='QR Code' src={item.qrcode} className='h-50px' />
                        </td>
                        <td className='text-center'>{item.click_count}</td>
                        <td className='text-center'>{item.attempt_count}</td>
                        <td>
                          <div className='d-flex action-btns justify-content-evenly'>
                            <Link
                              to={`/edit-campaign/${item._id}`}
                              state={item}
                              className='btn btn-secondary-outline btn-sm'
                            >
                              Edit
                            </Link>

                            <Link
                              to={{pathname: `/campaign-details/${item._id}`}}
                              state={item.title}
                              className='btn btn-sm btn-dark'
                              onClick={() => {
                                dispatch({
                                  type: TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE,
                                  campaignDetailsTableCurrentPage: 1,
                                })
                              }}
                            >
                              View
                            </Link>
                            {/* <button
                              type='button'
                              className='btn edit-questionnaire'
                              onClick={() => deleteCampaign(item._id)}
                            >
                              <KTSVG className='svg-icon-2 mr-0' path='/media/icons/delete.svg' />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : !error ? (
                  <div className='center no-data'>No data</div>
                ) : (
                  <div className='center no-data'>Unable to fetch data</div>
                )}
              </tbody>
            </table>

            {campaigns?.length > campaignsPerPage && searchKey === '' && (
              <PaginationWrappper
                postsPerPage={campaignsPerPage}
                totalPosts={campaigns.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                data={campaigns}
                indexOfLastPost={indexOfLastCampaign}
                indexOfFirstPost={indexOfFirstCampaign}
                type='campaignTableDashboard'
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export {CampaignTable}

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
import {TRIGGER_SEARCH_KEYWORD} from '../../redux/actions/actionTypes'
import {useDispatch} from 'react-redux'

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
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [campaignsPerPage, setCampaignsPerPage] = useState(5)
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

  const columns = [
    {
      id: 1,
      name: 'SR NO.',
      selector: (row: any) => row.id,
      maxWidth: '80px',
      minWidth: '80px',
      left: true,
    },
    {
      id: 2,
      name: 'COMPANY NAME',
      selector: (row: any) => row.companyName,
      minWidth: '180px',
    },
    {
      id: 3,
      name: 'COMPAIGN TITLE',
      selector: (row: any) => row.companyDetails,
      minWidth: '200px',
    },

    {
      id: 4,
      name: 'TYPE',
      selector: (row: any) => row.type,
      left: true,
      reorder: true,
      minWidth: '150px',
    },

    {
      id: 5,
      name: 'URL',
      selector: (row: any) => row.url,
      cell: (row: any) => (
        <Link to={row.url} className='text-dark'>
          {row.url}
        </Link>
      ),
      left: true,
      reorder: true,
      maxWidth: '150px',
    },

    {
      id: 6,
      name: 'QR CODE',
      image: true,
      grow: 0,
      cell: (row: any) => <img className='h-40px me-3' alt={row.name} src={row.qrCode} />,
      center: true,
      reorder: true,
      maxWidth: '100px',
    },

    {
      id: 7,
      name: 'USER CLICKS',
      selector: (row: any) => row.userClicks,
      center: true,
      reorder: true,
      minWidth: '60px',
    },

    {
      id: 8,
      name: 'TOTAL ATTEMPTS',
      selector: (row: any) => row.totalAttempts,
      center: true,
      reorder: true,
      maxWidth: '170px',
    },

    {
      id: 9,
      name: 'ACTION',
      maxWidth: '110px',
      minWidth: '110px',
      button: true,
      cell: (row: any) => (
        <div className='d-flex action-btns w-100 justify-content-between'>
          <button className='btn btn-sm btn-outline-dark mr-2'>Edit</button>

          <Link to={`/campaign/${row.id}`} className='btn btn-sm btn-dark'>
            View
          </Link>
        </div>
      ),
    },
  ]

  const getCampaignList = () => {
    setIsLoading(true)
    getCampaigns()
      .then((resp) => {
        setIsLoading(false)
        setCampaigns(resp.data.data)
      })
      .catch(() => {
        setIsLoading(false)
        setError(true)
      })
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
          return _.includes(_.lowerCase(JSON.stringify(_.values(user))), _.lowerCase(searchKey))
        })
        setCurrentData(filter)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [searchKey])

  useEffect(() => {
    if (searchKey === '') {
      setCurrentData(currentCampaignsList)
    }
  }, [currentCampaignsList])

  useEffect(() => {
    dispatch({
      type: TRIGGER_SEARCH_KEYWORD,
      searchKey: '',
    })
  }, [])

  return (
    <div className={`campaign-table-wrapper ${className}`}>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h1 className='my-5'>Campaign Details</h1>
        {showButtons && (
          <div className='d-flex flex-wrap my-2'>
            <div className='me-4'>
              <CSVLink
                data={campaigns}
                className='btn btn-outline-dark btn-sm rounded-pill'
                filename={'Campaigns.csv'}
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
                        <td className='text-start'>{item.company_name}</td>
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
                              href={`http://localhost:3011/verify-mobile?campaignId=${item._id}`}
                            >{`http://localhost:3011/verify-mobile?campaignId=${item._id}`}</a>
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
                              to={`/campaign-details/${item._id}`}
                              className='btn btn-sm btn-dark'
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
                postsPerPage={5}
                totalPosts={campaigns.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                data={campaigns}
                indexOfLastPost={indexOfLastCampaign}
                indexOfFirstPost={indexOfFirstCampaign}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export {CampaignTable}

/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from 'moment'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useParams} from 'react-router'
import PaginationWrappper from '../../../../_metronic/layout/components/pagination/PaginationWrapper'
import {useAppSelector} from '../../../redux/hooks/hooks'
import _, {debounce} from 'lodash'
import {
  TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE,
  TRIGGER_SEARCH_KEYWORD,
} from '../../../redux/actions/actionTypes'

type Props = {
  data?: any
  ref?: any
  error?: boolean
}

const CampaignDetailsTable: React.FC<Props> = ({data, error}) => {
  const {searchKey} = useAppSelector((state) => state.searchReducer)
  const {campaignDetailsTableCurrentPage} = useAppSelector((state) => state.paginationReducer)
  const {type} = useParams()
  console.log('🚀 ~ file: CampaignDetailsTable.tsx ~ line 24 ~ type', type)

  const columns = useMemo(
    () => [
      {
        id: 1,
        name: 'QUESTION ID.',
        selector: (row: any) => row.id,
        maxWidth: '120px',
        left: true,
      },
      {
        id: 2,
        name: 'USER WINNER NAME',
        selector: (row: any) => row.name,
        maxWidth: '180px',
      },
      {
        id: 3,
        name: 'DATE',
        selector: (row: any) => row.date,
        maxWidth: '150px',
      },

      {
        id: 4,
        name: 'EMAIL',
        selector: (row: any) => row.email,
        left: true,
        reorder: true,
        maxWidth: '160px',
      },

      {
        id: 5,
        name: 'MOBILE',
        selector: (row: any) => row.mobile,
        left: true,
        reorder: true,
        maxWidth: '120px',
      },

      {
        id: 6,
        name: 'TOTAL USER ATTEMPTS',
        selector: (row: any) => row.totalAttempts,
        center: true,
        reorder: true,
        maxWidth: '170px',
      },

      {
        id: 7,
        name: 'GIFT',
        selector: (row: any) => row.gift,
        left: true,
        reorder: true,
        minWidth: '150px',
      },

      {
        id: 8,
        name: 'ANSWER',
        selector: (row: any) => row.answer,
        right: true,
        reorder: true,
        maxWidth: '120px',
      },
    ],
    []
  )

  const [posts, setPosts] = useState(data || [])
  const [currentPage, setCurrentPage] = useState(campaignDetailsTableCurrentPage || 1)
  const [postsPerPage, setPostsPerPage] = useState(10)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentUsers = posts?.length && posts.slice(indexOfFirstPost, indexOfLastPost)
  const dispatch = useDispatch()
  const [currentData, setCurrentData] = useState(currentUsers)

  useEffect(() => {
    if (searchKey !== '') {
      const timeout = setTimeout(() => {
        const filter = _.filter(posts, (user) => {
          return _.includes(_.lowerCase(JSON.stringify(_.values(user))), _.lowerCase(searchKey))
        })
        setCurrentData(filter)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [searchKey])

  useEffect(() => {
    if (searchKey === '') {
      setCurrentData(currentUsers)
    }
  }, [currentUsers])

  useEffect(() => {
    dispatch({
      type: TRIGGER_SEARCH_KEYWORD,
      searchKey: '',
    })
  }, [])

  return (
    <div className='campaign-details-table'>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          {type ? (
            <table className='table campaign-table table-row-dashed table-row-gray-300 align-middle gs-0'>
              <thead className='bg-secondary rounded'>
                <tr className='fw-bold text-dark'>
                  {/* <th className='min-w-100px text-center'> QUESTION ID</th> */}
                  <th className='min-w-100px'>USER NAME</th>
                  {type !== 'totalUsers' && <th className='min-w-100px'>CAMPAIGN NAME</th>}

                  {/* <th className='min-w-100px'>LAST NAME</th> */}
                  <th className='max-w-100px text-center'>MOBILE</th>
                  <th className='min-w-120px text-center'>DATE OF CREATION</th>
                  {/* <th className='min-w-100px'>EMAIL</th> */}
                  {/* <th className='min-w-100px text-center'>TOTAL USER ATTEMTS</th>
                <th className='min-w-100px'>GIFT</th> */}
                  {/* <th className='min-w-100px text-center'>Pincode</th> */}
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 && !error ? (
                  currentData.map((item, i) => {
                    return (
                      <tr key={i}>
                        {/* <td className='text-center'>{item._id}</td> */}
                        <td>{item?.first_name + ' ' + item?.last_name}</td>
                        {type !== 'totalUsers' && <td>{item?.campaign_name}</td>}
                        {/* <td>{item?.last_name}</td> */}

                        <td className='text-center'>
                          {item?.country_code + '-' + (item?.mobile_no || '')}
                        </td>
                        <td className='text-center'>
                          {new Date(item.created_at).toLocaleString()}
                        </td>
                        {/* <td>{item?.email}</td> */}

                        {/* <td className='text-center'>{item.game_played}</td>
                      <td>{item.gift_unlock_text}</td> */}
                        {/* <td className='text-center'>{item.comments}</td> */}
                      </tr>
                    )
                  })
                ) : !currentData.length && !error ? (
                  <div className='center no-data'>No data</div>
                ) : (
                  <div className='center no-data'>Unable to fetch data</div>
                )}
              </tbody>
            </table>
          ) : (
            <table className='table campaign-table table-row-dashed table-row-gray-300 align-middle gs-0'>
              <thead className='bg-secondary rounded'>
                <tr className='fw-bold text-dark'>
                  {/* <th className='min-w-100px text-center'> QUESTION ID</th> */}
                  <th className='min-w-100px'>USER WINNER NAME</th>
                  {/* <th className='min-w-120px'>DATE</th> */}
                  <th className='min-w-100px'>EMAIL</th>
                  <th className='max-w-100px'>MOBILE</th>
                  {/* <th className='min-w-100px text-center'>TOTAL USER ATTEMTS</th>
                <th className='min-w-100px'>GIFT</th> */}
                  <th className='min-w-100px text-center'>Pincode</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 && !error ? (
                  currentData.map((item, i) => {
                    return (
                      <tr key={i}>
                        {/* <td className='text-center'>{item._id}</td> */}
                        <td>{item.submitted_detail_name}</td>

                        {/* <td>{moment.utc(item.created_at).format('DD/MM/YYYY')}</td> */}
                        <td>{item.submitted_detail_email}</td>
                        <td>{item.submitted_detail_mobileno}</td>

                        {/* <td className='text-center'>{item.game_played}</td>
                      <td>{item.gift_unlock_text}</td> */}
                        <td className='text-center'>{item.submitted_detail_comments}</td>
                      </tr>
                    )
                  })
                ) : !currentData.length && !error ? (
                  <div className='center no-data'>No data</div>
                ) : (
                  <div className='center no-data'>Unable to fetch data</div>
                )}
              </tbody>
            </table>
          )}
        </div>

        {data?.length > postsPerPage && !searchKey && (
          <PaginationWrappper
            postsPerPage={postsPerPage}
            totalPosts={posts.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            data={posts}
            indexOfLastPost={indexOfLastPost}
            indexOfFirstPost={indexOfFirstPost}
            type='campaignDetailsTable'
          />
        )}
      </div>
    </div>
  )
}

export {CampaignDetailsTable}

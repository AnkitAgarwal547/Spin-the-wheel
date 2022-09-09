/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import React, {useEffect, useRef, useState} from 'react'
import {useQuery} from 'react-query'
import {DownloadTableExcel} from 'react-export-table-to-excel'
import {useNavigate, useMatch, generatePath} from 'react-router'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import PaginationWrappper from '../../../_metronic/layout/components/pagination/PaginationWrapper'
import {useAppSelector} from '../../redux/hooks/hooks'
import Loader from '../../shared/Loader'
import {getRequest} from '../auth/core/_requests'
import './CompaignTable.scss'

type Props = {
  className: string
  showButtons: boolean
}

const CampaignTable: React.FC<Props> = ({className, showButtons}) => {
  const dummyData = [
    {
      id: 1,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },
    {
      id: 2,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },
    {
      id: 3,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 10,
      totalAttempts: 10,
    },
    {
      id: 4,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },
    {
      id: 5,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },

    {
      id: 5,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },
    {
      id: 5,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },
    {
      id: 5,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },
    {
      id: 5,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },
    {
      id: 5,
      companyName: 'Lorem Ipsum',
      companyDetails: 'Tata aig speen the wheel',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 100,
      totalAttempts: 10,
    },
  ]
  const {searchKey} = useAppSelector((state) => state.searchReducer)
  const [posts, setPosts] = useState(dummyData)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(5)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const tableRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getRequest()
      .then((resp) => {
        setIsLoading(false)
      })
      .catch(() => {})
  }, [searchKey])

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

  return (
    <div className={`campaign-table-wrapper ${className}`}>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h1 className='my-5'>Campaign Details</h1>
        {showButtons && (
          <div className='d-flex flex-wrap my-2'>
            <div className='me-4'>
              <DownloadTableExcel
                filename='users table'
                sheet='users'
                currentTableRef={tableRef.current}
              >
                <button className='btn btn-outline-dark btn-sm rounded-pill'>Export</button>
              </DownloadTableExcel>
            </div>

            <Link to='/new-campaign' className='btn btn-dark btn-sm rounded-pill'>
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
            <table
              className='table campaign-table table-row-dashed table-row-gray-300 align-middle gs-0'
              ref={tableRef}
            >
              <thead className='bg-dark rounded'>
                <tr className='fw-bold text-muted'>
                  <th className='min-w-100px text-center'>SR NO.</th>
                  <th className='min-w-100px'>COMPANY NAME</th>
                  <th className='min-w-120px text-center'>COMPAIGN TITLE</th>
                  <th className='min-w-100px text-center'>TYPE</th>
                  <th className='max-w-100px text-center'>URL</th>
                  <th className='min-w-100px text-center'>OR CODE</th>
                  <th className='min-w-100px text-center'>USER CLICKS</th>
                  <th className='min-w-100px text-center'>TOTAL ATTEMPTS</th>
                  <th className='min-w-150px text-center'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className='text-center'>{item.id}</td>
                      <td className='text-start'>{item.companyName}</td>
                      <td className='text-center'>{item.companyDetails}</td>
                      <td>{item.type}</td>
                      <td>
                        <a className='text-truncate text-dark' href={item.url}>
                          {item.url}
                        </a>
                      </td>
                      <td className='text-center'>
                        <img alt='Logo' src={item.qrCode} className='h-50px me-3' />
                      </td>
                      <td className='text-center'>{item.userClicks}</td>
                      <td className='text-center'>{item.totalAttempts}</td>
                      <td>
                        <div className='d-flex action-btns justify-content-evenly'>
                          <Link
                            to={`/edit-campaign/${item.id}`}
                            className='btn btn-sm btn-outline-dark mr-2'
                          >
                            Edit
                          </Link>

                          <Link to={`/campaign-details/${item.id}`} className='btn btn-sm btn-dark'>
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <PaginationWrappper
              postsPerPage={5}
              totalPosts={posts.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              data={posts}
              indexOfLastPost={indexOfLastPost}
              indexOfFirstPost={indexOfFirstPost}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export {CampaignTable}

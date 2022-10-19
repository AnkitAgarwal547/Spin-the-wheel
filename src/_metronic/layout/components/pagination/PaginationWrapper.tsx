import React, {useEffect, useState} from 'react'
import Pagination from 'react-bootstrap/Pagination'
import {useDispatch} from 'react-redux'
import {
  TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE,
  TRIGGER_CAMPAIGN_TABLE_CURRENT_PAGE,
  TRIGGER_QUESTIONNAIRE_CURRENT_PAGE,
} from '../../../../app/redux/actions/actionTypes'
import {useAppDispatch} from '../../../../app/redux/hooks/hooks'
import './Pagination.scss'

export default function PaginationWrappper(props: any) {
  const {
    totalPosts,
    currentPage,
    setCurrentPage,
    data = [],
    postsPerPage,
    currentData,
    type,
  } = props
  const dispatch = useAppDispatch()

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    if (type === 'questionnaire') {
      dispatch({
        type: TRIGGER_QUESTIONNAIRE_CURRENT_PAGE,
        questionnaireCurrentPage: pageNumber,
      })
    } else if (type === 'campaignTableDashboard') {
      dispatch({
        type: TRIGGER_CAMPAIGN_TABLE_CURRENT_PAGE,
        campaignTableCurrentPage: pageNumber,
      })
    } else if (type === 'campaignDetailsTable') {
      dispatch({
        type: TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE,
        campaignDetailsTableCurrentPage: pageNumber,
      })
    }
  }

  const pageNumbers: any[] = []

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleClickPrevious = () => {
    if (currentPage === 1) {
      return
    }
    setCurrentPage(currentPage - 1)
    paginate(currentPage - 1)
  }

  const handleClickNext = () => {
    if (currentPage === data.length - 1) {
      return
    }
    setCurrentPage(currentPage + 1)
    paginate(currentPage + 1)
  }

  return (
    <Pagination className='justify-content-end mb-5' size='sm'>
      <Pagination.Prev onClick={() => handleClickPrevious()} disabled={currentPage === 1} />

      {pageNumbers.map((number) => (
        <Pagination.Item
          key={number}
          className={'paget-item ' + (currentPage === number ? 'active' : 'hidden')}
          onClick={() => paginate(number)}
        >
          {number}
        </Pagination.Item>
      ))}

      <Pagination.Next
        disabled={currentPage === pageNumbers.length}
        onClick={() => handleClickNext()}
      />
    </Pagination>
  )
}

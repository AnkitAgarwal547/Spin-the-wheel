import React, {useEffect, useState} from 'react'
import Pagination from 'react-bootstrap/Pagination'
import './Pagination.scss'

export default function PaginationWrappper(props: any) {
  const {totalPosts, currentPage, setCurrentPage, data = [], postsPerPage} = props

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
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
    <Pagination className='justify-content-end' size='sm'>
      <Pagination.Prev
        onClick={() => handleClickPrevious()}
        disabled={currentPage === pageNumbers.length - 1 || pageNumbers.length === 1}
      />
      {pageNumbers.map((number) => (
        <li className='page-item' key={number}>
          <Pagination.Item
            className={'paget-item ' + (currentPage === number ? 'active' : 'hidden')}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        </li>
      ))}

      <Pagination.Next
        disabled={currentPage !== pageNumbers.length - 1 || pageNumbers.length === 1}
        onClick={() => handleClickNext()}
      />
    </Pagination>
  )
}

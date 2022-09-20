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
    <Pagination className='justify-content-end mb-10' size='sm'>
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

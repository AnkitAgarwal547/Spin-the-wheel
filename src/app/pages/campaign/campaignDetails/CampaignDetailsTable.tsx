/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import PaginationWrappper from '../../../../_metronic/layout/components/pagination/PaginationWrapper'

type Props = {
  className?: string
  showButtons?: boolean
}

const CampaignDetailsTable: React.FC<Props> = ({className, showButtons}) => {
  const dummyData = [
    {
      id: 1,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Get 5% off',
      answer: 'correct',
      totalAttempts: 10,
    },
    {
      id: 2,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Get 50% off',
      answer: 'correct',
      totalAttempts: 10,
    },
    {
      id: 3,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Get 50% off',
      userClicks: 10,
      totalAttempts: 10,
      answer: 'Incorrect',
    },
    {
      id: 4,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Better luck next time',
      answer: 'correct',
      totalAttempts: 10,
    },
    {
      id: 5,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Get 50% off',
      answer: 'correct',
      totalAttempts: 10,
    },

    {
      id: 5,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Get 50% off',
      answer: 'correct',
      totalAttempts: 10,
    },

    {
      id: 5,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Get 50% off',
      answer: 'correct',
      totalAttempts: 10,
    },

    {
      id: 5,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Get 50% off',
      answer: 'correct',
      totalAttempts: 10,
    },

    {
      id: 5,
      name: 'John serben',
      date: '7-8-2022',
      email: 'abc@gmail.com',
      mobile: 9821169216,
      gift: 'Get 50% off',
      answer: 'correct',
      totalAttempts: 10,
    },
  ]

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

  const [posts, setPosts] = useState(dummyData)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(5)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <div className='campaign-details-table'>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table campaign-table table-row-dashed table-row-gray-300 align-middle gs-0'>
            <thead className='bg-dark rounded'>
              <tr className='fw-bold text-muted'>
                <th className='min-w-100px text-center'> QUESTION ID</th>
                <th className='min-w-100px'>USER WINNER NAME</th>
                <th className='min-w-120px'>DATE</th>
                <th className='min-w-100px'>EMAIL</th>
                <th className='max-w-100px'>MOBILE</th>
                <th className='min-w-100px text-center'>TOTAL USER ATTEMTS</th>
                <th className='min-w-100px'>GIFT</th>
                <th className='min-w-100px text-center'>ANSWER</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((item, i) => {
                return (
                  <tr key={i}>
                    <td className='text-center'>{item.id}</td>
                    <td>{item.name}</td>

                    <td>{item.date}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>

                    <td className='text-center'>{item.totalAttempts}</td>
                    <td>{item.gift}</td>
                    <td className='text-center'>{item.answer}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
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
    </div>
  )
}

export {CampaignDetailsTable}

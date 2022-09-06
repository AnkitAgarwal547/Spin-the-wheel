/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {Button, Form} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import PaginationWrappper from '../../../../_metronic/layout/components/pagination/PaginationWrapper'
import ContentEditable from 'react-contenteditable'

import './QuestionnaireTable.scss'
type Props = {
  className?: string
}

const QuestionnaireTable: React.FC<Props> = ({}) => {
  const [selectedItem, setSelectedItem] = useState(0)
  const [addNewQuestionnaire, setAddNewQuestionnaire] = useState(false)
  // const columns = [
  //   {
  //     name: 'QUESTION',
  //     selector: (row: any) => row.title,
  //   },
  //   {
  //     name: 'OPTION 1.',
  //     selector: (row: any) => row.year,
  //   },
  //   {
  //     name: 'OPTION 2.',
  //     selector: (row: any) => row.year,
  //   },

  //   {
  //     name: 'DIFFICULTY LEVEL',
  //     selector: (row: any) => row.year,
  //   },
  // ]

  const data = [
    {
      id: 1,
      title: 'Beetlejuice',
      year: '1988',
    },
    {
      id: 2,
      title: 'Ghostbusters',
      year: '1984',
    },
  ]
  const dummyData = [
    {
      id: 1,
      question: 'Lorem Ipsum',
      option1: 'lorem',
      option2: 'ipsum',
      difficultyLevel: 'easy',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
    },
    {
      id: 2,
      question: 'Lorem Ipsum',
      option1: 'lorem',
      option2: 'ipsum',
      difficultyLevel: 'difficult',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
    },
    {
      id: 3,
      question: 'Lorem Ipsum',
      option1: 'lorem',
      option2: 'ipsum',
      difficultyLevel: 'medium',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
      userClicks: 10,
      totalAttempts: 10,
    },
    {
      id: 4,
      question: 'Lorem Ipsum',
      option1: 'lorem',
      option2: 'ipsum',
      difficultyLevel: 'easy',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
    },
    {
      id: 5,
      question: 'Lorem Ipsum',
      option1: 'lorem',
      option2: 'ipsum',
      difficultyLevel: 'easy',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
    },
    {
      id: 5,
      question: 'Lorem Ipsum',
      option1: 'lorem',
      option2: 'ipsum',
      difficultyLevel: 'easy',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
    },

    {
      id: 5,
      question: 'Lorem Ipsum',
      option1: 'lorem',
      option2: 'ipsum',
      difficultyLevel: 'easy',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
    },

    {
      id: 5,
      question: 'Lorem Ipsum',
      option1: 'lorem',
      option2: 'ipsum',
      difficultyLevel: 'easy',
      type: 'Spin The Wheel',
      url: 'https://getbootstra',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png',
    },
  ]

  const [posts, setPosts] = useState(dummyData)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(5)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currrentQuestionnaireList = posts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <div>
      <div className='d-flex flex-wrap flex-stack'>
        <h1 className='mb-0'>Questionnaire</h1>
        {
          <div className='d-flex flex-wrap my-2'>
            <Link
              to=''
              className='btn btn-dark btn-sm rounded-pill'
              onClick={() => setAddNewQuestionnaire(true)}
            >
              <i className='bi bi-plus-lg'></i>Add
            </Link>
          </div>
        }
      </div>
      <hr className='my-3' />

      {addNewQuestionnaire && (
        <div className='table-responsive add-new-questionnaire-header px-5 pb-1 rounded mb-5'>
          {/* begin::Table */}
          <table className='table campaign-table table-row-dashed table-row-gray-300 align-middle gs-0 mb-0'>
            {/* begin::Table head */}
            <thead className=''>
              <tr className='fw-bold text-dark'>
                <th className='min-w-100px'>QUESTION</th>
                <th className='min-w-120px'>OPTION 1.</th>
                <th className='min-w-100px'>OPTION 2.</th>
                <th className='max-w-100px'>DIFFICULTY LEVEL</th>
                <th className='min-w-100px text-center'>ACTION</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <input type='text' className='form-control' />
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <div className='d-flex align-items-center'>
                      <input type='text' className='form-control' />

                      <Form.Check
                        className='text-center my-auto mx-4 mt-4 '
                        name='group1'
                        type='radio'
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <div className='d-flex align-items-center'>
                      <input type='text' className='form-control' />

                      <Form.Check
                        className='text-center my-auto mx-4 mt-4 '
                        name='group1'
                        type='radio'
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <Form.Select aria-label='Default select example'>
                    <option value='difficult'>Difficult</option>
                    <option value='medium'>Medium</option>
                    <option value='easy'>Easy</option>
                  </Form.Select>
                </td>

                <td>
                  <div className='d-flex action-btns justify-content-evenly'>
                    <Button variant='outline-dark' onClick={() => {}}>
                      <i className='bi bi-plus-lg pe-0'></i>
                    </Button>
                    <Button variant='danger' onClick={() => {}}>
                      <i className='bi bi-trash3  pe-0'></i>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
      )}

      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table campaign-table table-row-dashed table-row-gray-300 align-middle gs-0'>
            <thead className='bg-dark rounded'>
              <tr className='fw-bold text-muted'>
                <th className='min-w-50px text-center'>SR NO.</th>
                <th className='min-w-100px'>QUESTION</th>
                <th className='min-w-120px'>OPTION 1.</th>
                <th className='min-w-100px'>OPTION 2.</th>
                <th className='max-w-100px'>DIFFICULTY LEVEL</th>
                <th className='min-w-100px text-center'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currrentQuestionnaireList.map((item, i) => {
                return (
                  <tr key={i}>
                    <td className='p-1 pl-5 text-center'>
                      <div>{item.id}</div>
                    </td>
                    <td>
                      {item.id === selectedItem ? (
                        <ContentEditable
                          className='form-control'
                          html={item.question}
                          contentEditable={item.id === selectedItem}
                          onChange={() => {}}
                        />
                      ) : (
                        item.question
                      )}
                    </td>
                    <td>
                      {item.id === selectedItem ? (
                        <div className='d-flex align-items-center'>
                          <ContentEditable
                            className='form-control'
                            html={item.option1}
                            disabled={false}
                            onChange={() => {}}
                          />
                          <Form.Check
                            className='text-center my-auto mx-4 mt-4 '
                            name='group1'
                            type='radio'
                          />
                        </div>
                      ) : (
                        item.option1
                      )}
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        {item.id === selectedItem ? (
                          <div className='d-flex align-items-center'>
                            <ContentEditable
                              className='form-control'
                              html={item.option2}
                              disabled={false}
                              onChange={() => {}}
                            />
                            <Form.Check
                              className='text-center my-auto mx-4 mt-4 '
                              name='group1'
                              type='radio'
                            />
                          </div>
                        ) : (
                          item.option2
                        )}
                      </div>
                    </td>
                    <td>
                      {item.id === selectedItem ? (
                        <Form.Select aria-label='Default select example'>
                          <option value='difficult'>Difficult</option>
                          <option value='medium'>Medium</option>
                          <option value='easy'>Easy</option>
                        </Form.Select>
                      ) : (
                        item.difficultyLevel
                      )}
                    </td>

                    <td>
                      <div className='d-flex action-btns justify-content-evenly'>
                        {item.id === selectedItem ? (
                          <>
                            <Button
                              variant='outline-dark'
                              onClick={() => {
                                setSelectedItem(item.id)
                              }}
                            >
                              <i className='bi bi-check-lg  pe-0'></i>
                            </Button>
                            <Button
                              variant='danger'
                              onClick={() => {
                                setSelectedItem(item.id)
                              }}
                            >
                              <i className='bi bi-x-lg  pe-0'></i>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant='outline-dark'
                              onClick={() => {
                                setSelectedItem(item.id)
                              }}
                            >
                              <i className='bi bi-pencil-square pe-0'></i>
                            </Button>
                            <Button variant='danger'>
                              <i className='bi bi-trash3 pe-0'></i>
                            </Button>
                          </>
                        )}
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
      </div>
    </div>
  )
}

export {QuestionnaireTable}

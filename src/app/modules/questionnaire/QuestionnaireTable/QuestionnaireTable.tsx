/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {Button, Form} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import PaginationWrappper from '../../../../_metronic/layout/components/pagination/PaginationWrapper'
import {ToastContainer, toast} from 'react-toastify'
import {useQuery} from 'react-query'
import './QuestionnaireTable.scss'
import {KTSVG} from '../../../../_metronic/helpers'
import _, {debounce} from 'lodash'
import {
  deleteQuestionnaire,
  getQuestionnaire,
  getRequest,
  postQuestionnaire,
  postRequest,
  putQuestionnaire,
} from '../../auth/core/_requests'
import Loader from '../../../shared/Loader'
import {useAppSelector} from '../../../redux/hooks/hooks'
import {Formik, useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {ToastMessage} from '../../../shared/ToastMessage'
import {TRIGGER_SEARCH_KEYWORD} from '../../../redux/actions/actionTypes'
import {useDispatch} from 'react-redux'

type Props = {
  className?: string
}

const QuestionnaireTable: React.FC<Props> = ({}) => {
  const [selectedItem, setSelectedItem] = useState(0)
  const [selectedItemToDelete, setSelectedToDelete] = useState(0)
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

  const [posts, setPosts] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEdit, setIsLoadingEdit] = useState(false)
  const [isLoadingAdd, setIsLoadingAdd] = useState(false)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const [postsPerPage, setPostsPerPage] = useState(10)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currrentQuestionnaireList = posts.slice(indexOfFirstPost, indexOfLastPost)
  const {searchKey} = useAppSelector((state) => state.searchReducer)
  const [error, setError] = useState(false)
  const [currentData, setCurrentData] = useState(currrentQuestionnaireList)
  // console.log('🚀 ~ file: QuestionnaireTable.tsx ~ line 69 ~ currentData', currentData)
  const dispatch = useDispatch()
  const loginSchema = Yup.object().shape({
    question: Yup.string().required('Question is required'),
    type: Yup.string().required('Type is required'),
    option1: Yup.string().required('Option1 is required'),
    option2: Yup.string().required('Option2 is required'),
    answer1: Yup.boolean(),
    answer2: Yup.boolean(),
  })

  const initialValues = {
    question: '',
    type: '',
    option1: '',
    option2: '',
    answer1: false,
    answer2: true,
  }

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
      setCurrentData(currrentQuestionnaireList)
    }
  }, [currrentQuestionnaireList])

  useEffect(() => {
    dispatch({
      type: TRIGGER_SEARCH_KEYWORD,
      searchKey: '',
    })
  }, [])

  const patchQuestionnaire = (item) => {
    setSelectedItem(item._id)
    setAddNewQuestionnaire(false)

    const fields = ['question', 'option1', 'option2', 'answer1', 'answer2', 'type']

    fields.forEach((field) => {
      if (field === 'question' || field === 'type') {
        formik.setFieldValue(field, item[field], false)
      }
      if (field === 'option1') {
        formik.setFieldValue(field, item['options'][0], false)
      }
      if (field === 'option2') {
        formik.setFieldValue(field, item['options'][1], false)
      }
      if (field === 'answer1') {
        if (item.answer === '1') {
          formik.setFieldValue(field, true, false)
        } else {
          formik.setFieldValue(field, false, false)
        }
      }
      if (field === 'answer2') {
        if (item.answer === '2') {
          formik.setFieldValue(field, true, false)
        } else {
          formik.setFieldValue(field, false, false)
        }
      }
    })
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      const payload: any = {
        question: values.question,
        options: [values.option1, values.option2],
        type: values.type,
        answer: values.answer1 ? '1' : '2',
      }
      if (selectedItem) {
        setIsLoadingEdit(true)
        payload.status = 'ACTIVE'
        putQuestionnaire(selectedItem, payload)
          .then((resp) => {
            setIsLoadingEdit(false)
            getQuestionnaireList()
            ToastMessage('Question updated successfully!', 'success')
            formik.resetForm()
            setSelectedItem(0)
          })

          .catch((err) => {
            setIsLoadingEdit(false)
            ToastMessage('Something went wrong!', 'error')
          })
      } else {
        setIsLoadingAdd(true)

        postQuestionnaire(payload)
          .then((resp) => {
            setIsLoadingAdd(false)
            getQuestionnaireList()
            ToastMessage('Question added successfully!', 'success')
            // setAddNewQuestionnaire(false)
            formik.resetForm()
          })

          .catch((err) => {
            setIsLoadingAdd(false)
            ToastMessage('Something went wrong!', 'error')
          })
      }
    },
  })

  useEffect(() => {
    getQuestionnaireList()
  }, [searchKey])

  const getQuestionnaireList = () => {
    setIsLoading(true)
    getQuestionnaire()
      .then((resp) => {
        setPosts(resp.data.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
        ToastMessage('Something went wrong!', 'error')
        setError(true)
      })
  }

  const deleteQuestion = (id) => {
    setIsLoadingDelete(true)
    setSelectedToDelete(id)
    deleteQuestionnaire(id)
      .then((resp) => {
        setIsLoadingDelete(false)
        setSelectedToDelete(0)
        ToastMessage('Question deleted successfully!', 'success')
        console.log('currentData', currentData)
        if (currentData.length === 1 && currentPage !== 1) {
          setCurrentPage(currentPage - 1)
        }
        getQuestionnaireList()
      })
      .catch(() => {
        setIsLoadingDelete(false)
        ToastMessage('Something went wrong!', 'error')
      })
  }

  const questionFormControl = () => {
    return (
      <input
        type='text'
        {...formik.getFieldProps('question')}
        className={clsx(
          'form-control ',
          {'is-invalid': formik.touched.question && formik.errors.question},
          {
            'is-valid': formik.touched.question && !formik.errors.question,
          }
        )}
      />
    )
  }

  const option1FormControl = () => {
    return (
      <div className='d-flex align-items-center'>
        <div className='d-flex align-items-center'>
          <input
            type='text'
            {...formik.getFieldProps('option1')}
            className={clsx(
              'form-control ',
              {'is-invalid': formik.touched.option1 && formik.errors.option1},
              {
                'is-valid': formik.touched.option1 && !formik.errors.option1,
              }
            )}
          />

          <input
            {...formik.getFieldProps('answer1')}
            type='radio'
            className={clsx(
              'ftext-center my-auto mx-4 ',
              {'is-invalid': formik.touched.answer1 && formik.errors.answer1},
              {
                'is-valid': formik.touched.answer1 && !formik.errors.answer1,
              }
            )}
            checked={formik.values.answer1}
            onChange={(e) => {
              formik.setFieldValue('answer1', e.target.checked)
              formik.setFieldValue('answer2', !e.target.checked)
            }}
          />
        </div>
      </div>
    )
  }

  const option2FormControl = () => {
    return (
      <div className='d-flex align-items-center'>
        <div className='d-flex align-items-center'>
          <input
            type='text'
            {...formik.getFieldProps('option2')}
            className={clsx(
              'form-control ',
              {'is-invalid': formik.touched.option2 && formik.errors.option2},
              {
                'is-valid': formik.touched.option2 && !formik.errors.option2,
              }
            )}
          />
          <input
            {...formik.getFieldProps('answer2')}
            type='radio'
            className={clsx(
              'text-center my-auto mx-4 ',
              {'is-invalid': formik.touched.answer2 && formik.errors.answer2},
              {
                'is-valid': formik.touched.answer2 && !formik.errors.answer2,
              }
            )}
            checked={formik.values.answer2}
            onChange={(e) => {
              console.log(e.target.checked)
              formik.setFieldValue('answer2', e.target.checked)
              formik.setFieldValue('answer1', !e.target.checked)
            }}
          />
        </div>
      </div>
    )
  }

  const difficultyLevelFormControl = () => {
    return (
      <Form.Select
        aria-label='Default select example'
        {...formik.getFieldProps('type')}
        className={clsx(
          'form-control ',
          {'is-invalid': formik.touched.type && formik.errors.type},
          {
            'is-valid': formik.touched.type && !formik.errors.type,
          }
        )}
      >
        <option value='' disabled selected>
          Choose
        </option>
        <option value='DIFFICULT'>Difficult</option>
        <option value='MODERATE'>Moderate</option>
        <option value='EASY'>Easy</option>
      </Form.Select>
    )
  }

  return (
    <div className='questionnaire-table'>
      <div className='d-flex flex-wrap flex-stack'>
        <h1 className='mb-0'>Questionnaire</h1>
        {!addNewQuestionnaire && (
          <div className='d-flex flex-wrap my-2'>
            <Link
              to=''
              className='btn btn-primary btn-sm rounded-pill'
              onClick={() => {
                setAddNewQuestionnaire(true)
                setSelectedItem(0)
                formik.resetForm()
              }}
            >
              <KTSVG className='add-btn' path='/media/icons/plus.svg' />
              Add
            </Link>
          </div>
        )}
      </div>
      <hr className='my-3' />

      {addNewQuestionnaire && (
        <div className='table-responsive add-new-questionnaire-header px-5 pb-1 rounded mb-5'>
          <form className='form w-100' noValidate onSubmit={formik.handleSubmit}>
            <table className='table add-new-questionnaire-table table-row-dashed table-row-gray-300 align-middle gs-0 mb-0'>
              <thead className=''>
                <tr className='fw-bold text-light add-question-tr'>
                  <th className='min-w-100px'>QUESTION</th>
                  <th className='min-w-120px'>OPTION 1.</th>
                  <th className='min-w-100px'>OPTION 2.</th>
                  <th className='min-w-200px'>DIFFICULTY LEVEL</th>
                  <th className='w-100px text-center'>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{questionFormControl()}</td>
                  <td>{option1FormControl()}</td>
                  <td>{option2FormControl()}</td>
                  <td>{difficultyLevelFormControl()}</td>

                  <td>
                    <div className='d-flex action-btns justify-content-evenly'>
                      <button type='submit' className='btn edit-questionnaire'>
                        {isLoadingAdd ? (
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        ) : (
                          <KTSVG
                            className='svg-icon-2 mr-0'
                            path='/media/icons/add_questionnaire.svg'
                          />
                        )}
                      </button>

                      <button
                        type='button'
                        onClick={() => setAddNewQuestionnaire(false)}
                        className='btn edit-questionnaire'
                      >
                        <KTSVG className='svg-icon-2 mr-0' path='/media/icons/delete.svg' />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      )}

      <div className='questionnaire-table-div py-3'>
        {isLoading ? (
          <Loader size='1rem' className='center' />
        ) : (
          <div className='table-responsive'>
            <form className='form w-100' noValidate onSubmit={formik.handleSubmit}>
              <table className='table questionnaire-table table-row-dashed table-row-gray-300 align-middle gs-0'>
                <thead className='bg-secondary rounded'>
                  <tr className='fw-bold text-dark'>
                    <th className='w-100px text-center'>SR NO.</th>
                    <th className='min-w-100px'>QUESTION</th>
                    <th className='min-w-120px'>OPTION 1.</th>
                    <th className='min-w-120px'>OPTION 2.</th>
                    <th className='max-w-60px'>DIFFICULTY LEVEL</th>
                    <th className='w-100px text-center'>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 && posts.length && !error ? (
                    currentData.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td className='p-1 pl-5 text-center'>
                            <div>{(currentPage - 1) * postsPerPage + i + 1}</div>
                          </td>
                          <td>
                            {item._id === selectedItem ? questionFormControl() : item.question}
                          </td>
                          <td>
                            {item._id === selectedItem ? (
                              option1FormControl()
                            ) : (
                              <span className={clsx({'text-success': item?.answer === '1'})}>
                                {item?.options[0]}
                              </span>
                            )}
                          </td>
                          <td>
                            {item._id === selectedItem ? (
                              option2FormControl()
                            ) : (
                              <span className={clsx({'text-success': item?.answer === '2'})}>
                                {item.options[1]}
                              </span>
                            )}
                          </td>
                          <td>
                            {item._id === selectedItem ? difficultyLevelFormControl() : item.type}
                          </td>

                          <td>
                            <div className='d-flex action-btns justify-content-evenly'>
                              {item._id === selectedItem ? (
                                <>
                                  <button type='submit' className='btn edit-questionnaire'>
                                    {isLoadingEdit && (
                                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    )}
                                    {selectedItem && !isLoadingEdit && (
                                      <KTSVG
                                        className='svg-icon-2 mr-0'
                                        path='/media/icons/check.svg'
                                      />
                                    )}
                                  </button>
                                  <Button
                                    variant=''
                                    className='btn edit-questionnaire'
                                    onClick={() => {
                                      setSelectedItem(0)
                                    }}
                                  >
                                    <KTSVG
                                      className='svg-icon-sm mr-0'
                                      path='/media/icons/cancel.svg'
                                    />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant=''
                                    className='btn edit-questionnaire'
                                    onClick={() => {
                                      patchQuestionnaire(item)
                                    }}
                                  >
                                    <KTSVG
                                      className='svg-icon-2 mr-0'
                                      path='/media/icons/edit.svg'
                                    />
                                  </Button>
                                  <button
                                    type='button'
                                    className='btn edit-questionnaire'
                                    onClick={() => {
                                      deleteQuestion(item._id)
                                    }}
                                  >
                                    {isLoadingDelete && selectedItemToDelete === item._id ? (
                                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    ) : (
                                      <KTSVG
                                        className='svg-icon-2 mr-0'
                                        path='/media/icons/delete.svg'
                                      />
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <div className='center no-data'>No data</div>
                  )}

                  {error && !currrentQuestionnaireList.length && !posts.length && (
                    <div className='center no-data'>Unable to fetch data</div>
                  )}
                </tbody>
              </table>
            </form>
            {posts.length > postsPerPage && !searchKey && (
              <PaginationWrappper
                postsPerPage={postsPerPage}
                totalPosts={posts.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                data={posts}
                indexOfLastPost={indexOfLastPost}
                indexOfFirstPost={indexOfFirstPost}
              />
            )}
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  )
}

export {QuestionnaireTable}

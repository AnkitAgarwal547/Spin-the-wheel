import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {Col, Form, Row} from 'react-bootstrap'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import * as Yup from 'yup'
import './UserDetails.scss'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import {useNavigate} from 'react-router'
import {useFormik} from 'formik'
import {TRIGGER_USER_DETAILS} from '../../../../../app/redux/actions/actionTypes'
import {getUserType, submitAnswer} from '../../../../../app/modules/auth/core/_requests'
import {ToastContainer} from 'react-toastify'
import {useAuth} from '../../../../../app/modules/auth'

export default function UserDetails() {
  const {
    campaignDetails,
    prizeDetails,
    questionDetails,
    answerDetails,
    startTime,
    endTime,
    mobileDetails,
  } = useAppSelector((state) => state.userReducer)
  console.log(
    '🚀 ~ file: UserDetails.tsx ~ line 17 ~ UserDetails ~ questionDetails',
    questionDetails
  )

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {currentUser} = useAuth()
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const pincode = /^\d{6}$/

  const schema = Yup.object().shape({
    name: Yup.string().required('required'),
    mobile_no: Yup.string()
      .required('required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'to short')
      .max(10, 'to long'),
    comments: Yup.string()
      .required('required')
      .matches(pincode, 'Pin code is not valid')
      .min(6, 'to short')
      .max(6, 'to long'),

    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Email is required'),
  })

  const initialValues = {
    name: mobileDetails?.first_name + ' ' + mobileDetails?.last_name,
    mobile_no: mobileDetails?.mobile_no,
    country_code: '+91',
    comments: '',
    email: '',
  }
  console.log('🚀 ~ file: UserDetails.tsx ~ line 56 ~ UserDetails ~ mobileDetails', mobileDetails)

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      console.log('answerDetails', answerDetails)
      const payload = {
        ques_id: questionDetails?._id,
        answer_selected: questionDetails?.options.findIndex((item) => item === answerDetails) + 1,
        is_correct_answer:
          questionDetails?.options.findIndex((item) => item === answerDetails) + 1 ==
          questionDetails?.answer
            ? 1
            : 0,
        name: values.name,
        email: values.email,
        mobileno: values.mobile_no,
        comments: values.comments,
        game_played: 1,
        gift_unlock_key: prizeDetails.key,
        gift_unlock_text: prizeDetails.label,
        answer_text: answerDetails,
        answer_timetaken: Math.abs(endTime - startTime),
      }

      console.log('payload', payload)
      setLoading(true)
      try {
        const {data} = await submitAnswer(payload, campaignDetails._id)
        setSubmitting(false)
        setLoading(false)
        ToastMessage('Details submitted successfully!', 'success')
        navigate('/terms-and-conditions')
      } catch (error: any) {
        setLoading(false)
        ToastMessage('Something went wrong!', 'error')
      }
    },
  })

  useEffect(() => {
    if (!currentUser) {
      navigate(`/error`)
    }
  }, [])

  return (
    <div className='user-details'>
      <div className='user-details-sub-div '></div>
      <div className='sub-div'>
        <div className='text-center heading'>Share your Details to Claim your Prize</div>
        <hr className='mt-1 mb-10' />
        <form onSubmit={formik.handleSubmit}>
          <div className='px-10'>
            <Row className='gx-5 gy-7'>
              <Col sm={6}>
                <Form.Label className='fw-bold'>Name</Form.Label>{' '}
                <Form.Control
                  type='text'
                  {...formik.getFieldProps('name')}
                  className={clsx(
                    'form-control form-control-lg ',
                    {'is-invalid': formik.touched.name && formik.errors.name},
                    {
                      'is-valid': formik.touched.name && !formik.errors.name,
                    }
                  )}
                  readOnly
                  value={formik.values.name}
                />
              </Col>
              <Col sm={6}>
                <Form.Label className='fw-bold'>Mobile Number</Form.Label>

                <Form.Control
                  type='number'
                  placeholder=''
                  {...formik.getFieldProps('mobile_no')}
                  className={clsx(
                    'form-control form-control-lg ',
                    {'is-invalid': formik.touched.mobile_no && formik.errors.mobile_no},
                    {
                      'is-valid': formik.touched.mobile_no && !formik.errors.mobile_no,
                    }
                  )}
                  readOnly
                  value={formik.values.mobile_no}
                />
              </Col>

              <Col sm={12}>
                <Form.Label className='fw-bold'>Email</Form.Label>

                <Form.Control
                  type='email'
                  placeholder=''
                  {...formik.getFieldProps('email')}
                  className={clsx(
                    'form-control form-control-lg ',
                    {'is-invalid': formik.touched.email && formik.errors.email},
                    {
                      'is-valid': formik.touched.email && !formik.errors.email,
                    }
                  )}
                  value={formik.values.email}
                />
              </Col>

              <Col sm={12}>
                <Form.Label className='fw-bold'>Pincode</Form.Label>
                <Form.Control
                  type='number'
                  placeholder=''
                  {...formik.getFieldProps('comments')}
                  className={clsx(
                    'form-control form-control-lg ',
                    {'is-invalid': formik.touched.comments && formik.errors.comments},
                    {
                      'is-valid': formik.touched.comments && !formik.errors.comments,
                    }
                  )}
                  value={formik.values.comments}
                />
                {formik.touched.comments && formik.errors.comments && (
                  <p className='text-danger'>Please enter 6 numbers!</p>
                )}

                {/* <textarea
                  rows={5}
                  {...formik.getFieldProps('comments')}
                  className={clsx(
                    'form-control form-control-lg ',
                    {'is-invalid': formik.touched.comments && formik.errors.comments},
                    {
                      'is-valid': formik.touched.comments && !formik.errors.comments,
                    }
                  )}
                  value={formik.values.comments}
                ></textarea> */}
              </Col>
              <Col sm={12}>
                <button
                  className='btn btn-dark btn-block w-100'
                  type='submit'
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!loading && <span className='indicator-label'>Submit</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </Col>
            </Row>
          </div>
        </form>
        <div className='logo-wrapper'>
          <img alt='logo' className='logo' src={campaignDetails?.logo_url} />
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

import clsx from 'clsx'
import React, {useState} from 'react'
import {Col, Form, Row} from 'react-bootstrap'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import * as Yup from 'yup'
import './UserDetails.scss'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import {useNavigate} from 'react-router'
import {useFormik} from 'formik'
import {TRIGGER_USER_DETAILS} from '../../../../../app/redux/actions/actionTypes'
import {submitAnswer} from '../../../../../app/modules/auth/core/_requests'
import {ToastContainer} from 'react-toastify'

export default function UserDetails() {
  const {campaignDetails, prizeDetails, questionDetails, answerDetails, startTime, endTime} =
    useAppSelector((state) => state.userReducer)
  console.log('🚀 ~ file: UserDetails.tsx ~ line 14 ~ UserDetails ~ endTime', endTime)
  console.log('🚀 ~ file: UserDetails.tsx ~ line 14 ~ UserDetails ~ startTime', startTime)
  console.log('🚀 ~ file: UserDetails.tsx ~ line 14 ~ UserDetails ~ answerDetails', answerDetails)
  console.log(
    '🚀 ~ file: UserDetails.tsx ~ line 14 ~ UserDetails ~ questionDetails',
    questionDetails
  )
  console.log('🚀 ~ file: UserDetails.tsx ~ line 14 ~ UserDetails ~ prizeDetails', prizeDetails)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  console.log(
    '🚀 ~ file: UserDetails.tsx ~ line 7 ~ UserDetails ~ campaignDetails',
    campaignDetails
  )

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const schema = Yup.object().shape({
    name: Yup.string().required('required'),
    mobile_no: Yup.string()
      .required('required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'to short')
      .max(10, 'to long'),
    comments: Yup.string().required('required'),

    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Email is required'),
  })

  const initialValues = {
    name: '',
    mobile_no: '9136035356',
    country_code: '+91',
    comments: 'comments',
    email: '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      console.log('🚀 ~ file: UserAuth.tsx ~ line 28 ~ onSubmit: ~ values', values)
      const payload = {
        ques_id: questionDetails?._id,
        answer_selected: questionDetails?.options.findIndex((item) => item === answerDetails),
        is_correct_answer: questionDetails?.answer,
        name: values.name,
        email: values.email,
        mobileno: values.mobile_no,
        comments: values.comments,
        game_played: 1,
        gift_unlock_key: prizeDetails.key,
        gift_unlock_text: prizeDetails.label,
        answer_text: answerDetails,
        answer_timetaken: Math.abs(((endTime - startTime) / 24) * 60 * 60 * 1000),
      }
      console.log('🚀 ~ file: UserDetails.tsx ~ line 72 ~ onSubmit: ~ payload', payload)
      setLoading(true)
      try {
        const {data} = await submitAnswer(payload, campaignDetails._id)
        setSubmitting(false)
        setLoading(false)
        // dispatch({
        //   type: TRIGGER_USER_DETAILS,
        //   userDetails: values,
        // })
        // navigate('/question')
        ToastMessage('Details submitted successfully!', 'success')
        navigate('/terms-and-conditions')
      } catch (error: any) {
        setLoading(false)
        ToastMessage('Something went wrong!', 'error')
      }
    },
  })
  return (
    <div className='user-details'>
      <div className='user-details-sub-div '></div> {/* <Row className='justify-content-center'> */}
      {/* <Col sm={8} xxl={8} xl={8} lg={8} className='rounded  p-10'> */}
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
                <Form.Label className='fw-bold'>Comments</Form.Label>

                <textarea
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
                ></textarea>
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
                {/* </Col> */}
                {/* </Row> */}
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
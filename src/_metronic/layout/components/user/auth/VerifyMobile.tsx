import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../helpers'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import clsx from 'clsx'
import {
  getUserCampaignDetailsRequest,
  getUserType,
  updateCount,
  userLogin,
} from '../../../../../app/modules/auth/core/_requests'
import {ToastContainer} from 'react-toastify'
import {useNavigate, useLocation} from 'react-router'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import './style.scss'
import {
  TRIGGER_CAMPAIGN_DETAILS,
  TRIGGER_MOBILE,
  TRIGGER_OTP,
  TRIGGER_PRIZE_INDEX,
  TRIGGER_QUESTION_DETAILS,
} from '../../../../../app/redux/actions/actionTypes'
import {useAuth} from '../../../../../app/modules/auth'
import {Col, Modal, Row} from 'react-bootstrap'
import {typeOfCampaigns} from '../../../../../app/modules/campaign/CampaignTable'

export default function VerifyMobile() {
  const [loading, setLoading] = useState(false)
  const search = useLocation().search
  const campaignId = new URLSearchParams(search).get('campaignId')
  const {campaignDetails} = useAppSelector((state) => state.userReducer)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [campaignStatus, setCampaignStatus] = useState(false)
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  var regName = /^[a-zA-Z ]{2,30}$/

  document.title =
    campaignDetails.type === typeOfCampaigns.SCRATCH_THE_CARD
      ? 'Scratch and win'
      : campaignDetails.type === typeOfCampaigns.SPIN_THE_WHEEL
      ? 'Spin the Wheel'
      : 'Choose the Box'

  const schema = Yup.object().shape({
    mobile_no: Yup.string()
      .required('required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'to short')
      .max(10, 'to long'),
    first_name: Yup.string().required('required').matches(regName, 'First name is not valid'),
    last_name: Yup.string().required('required').matches(regName, 'Last name is not valid'),
  })

  const initialValues = {
    mobile_no: '',
    country_code: '+91',
    first_name: '',
    last_name: '',
  }

  useEffect(() => {
    // if (currentUser && getUserType() == 'user') {
    //   navigate(`/campaign?id=${campaignId}`)
    // }
    if (campaignId) {
      getUserCampaignDetailsRequest(campaignId)
        .then((resp) => {
          // setCampaignDetails(resp.data.data)
          dispatch({
            type: TRIGGER_CAMPAIGN_DETAILS,
            campaignDetails: resp.data.data,
          })
        })
        .catch(() => {
          navigate('/error')
        })
    } else {
      navigate('/error')
      // logout()
    }

    dispatch({
      type: TRIGGER_QUESTION_DETAILS,
      questionDetails: '',
    })
  }, [])

  function removeTime(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  useEffect(() => {
    const date1 = new Date(campaignDetails.end_date)
    const date2 = new Date()

    date1.setHours(0, 0, 0, 0)
    date2.setHours(0, 0, 0, 0)

    if (campaignDetails !== '' && date1.getTime() < date2.getTime()) {
      setCampaignStatus(true)
    }
  }, [campaignDetails])

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const {data} = await userLogin(
          values.mobile_no.toString(),
          values.country_code,
          values.first_name,
          values.last_name
        )
        setSubmitting(false)
        setLoading(false)
        ToastMessage('OTP sent successfully!', 'success')
        navigate(
          {
            pathname: '/verify-otp',
            search: `?campaignId=${campaignId}&otpid=${data.data.otp_id}`,
          },
          {state: values}
        )
        dispatch({
          type: TRIGGER_MOBILE,
          mobileDetails: values,
        })

        dispatch({
          type: TRIGGER_PRIZE_INDEX,
          prizeIndex: '',
        })
        dispatch({
          type: TRIGGER_OTP,
          otpDetails: values,
        })
      } catch (error: any) {
        setLoading(false)
        ToastMessage('Something went wrong!', 'error')
      }
    },
  })

  return (
    <div
      className='verify-screens'
      style={{backgroundImage: `url(${campaignDetails?.frontend_img})`}}
    >
      <div
        className='user-details-sub-div'
        style={{
          backgroundImage: !campaignDetails?.frontend_img
            ? `url(
              'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/background.png'
            )`
            : `url(${campaignDetails?.frontend_img})`,
        }}
      ></div>
      <div className='sub-div'>
        <div className='text-center heading'>Mobile Number Verification</div>

        <div className='px-10'>
          <form onSubmit={formik.handleSubmit}>
            <Row>
              <Col xxl={6} xl={6} lg={6} md={6} sm={6}>
                {' '}
                <div className='form-group mt-15'>
                  <input
                    type='test'
                    placeholder='Enter your first name'
                    {...formik.getFieldProps('first_name')}
                    className={clsx(
                      'form-control form-control-lg ',
                      {'is-invalid': formik.touched.first_name && formik.errors.first_name},
                      {
                        'is-valid': formik.touched.first_name && !formik.errors.first_name,
                      }
                    )}
                    value={formik.values.first_name}
                  />

                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className='text-danger px-2 pt-1'>Please enter valid first name </p>
                  )}
                </div>
              </Col>
              <Col xxl={6} xl={6} lg={6} md={6} sm={6}>
                {' '}
                <div className='form-group mt-15'>
                  <input
                    type='test'
                    placeholder='Enter your last name'
                    {...formik.getFieldProps('last_name')}
                    className={clsx(
                      'form-control form-control-lg ',
                      {'is-invalid': formik.touched.last_name && formik.errors.last_name},
                      {
                        'is-valid': formik.touched.last_name && !formik.errors.last_name,
                      }
                    )}
                    value={formik.values.last_name}
                  />

                  {formik.touched.last_name && formik.errors.last_name && (
                    <p className='text-danger px-2 pt-1'>Please enter valid last name </p>
                  )}
                </div>
              </Col>
            </Row>

            <div className='form-group mt-5'>
              <input
                type='number'
                placeholder='Enter the 10 Digit Mobile Number'
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

              {formik.touched.mobile_no && formik.errors.mobile_no && (
                <p className='text-danger px-2 pt-1'>Please enter valid number</p>
              )}
            </div>
            <div className='d-grid mt-10'>
              <button
                className='btn btn-primary btn-lg'
                type='submit'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {!loading && <span className='indicator-label'>Send OTP</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className='logo-wrapper'>
          <img alt='logo' className='logo' src={campaignDetails?.logo_url} />
        </div>
      </div>
      <ToastContainer />

      <Modal centered show={campaignStatus} onHide={() => {}}>
        <Modal.Body className='text-center'>
          <h1 className='mb-0'>This campaign has been expired!</h1>
        </Modal.Body>
      </Modal>
    </div>
  )
}

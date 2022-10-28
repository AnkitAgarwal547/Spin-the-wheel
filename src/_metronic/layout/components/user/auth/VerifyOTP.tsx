import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../helpers'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import clsx from 'clsx'
import {
  getUserType,
  setToken,
  setUserType,
  updateCount,
  userLogin,
  verifyOtp,
} from '../../../../../app/modules/auth/core/_requests'
import {ToastContainer} from 'react-toastify'
import OtpInput from 'react-otp-input'
import {useLocation, useNavigate} from 'react-router'
import {useAuth} from '../../../../../app/modules/auth'
import {useAppSelector} from '../../../../../app/redux/hooks/hooks'
import {Footer} from '../../Footer'

export default function VerifyOTP() {
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()
  const location: any = useLocation()
  const search = useLocation().search
  const otpid = new URLSearchParams(search).get('otpid')
  const campaignId = new URLSearchParams(search).get('campaignId')
  const navigate = useNavigate()
  const {campaignDetails, mobileDetails} = useAppSelector((state) => state.userReducer)
  const {otpDetails} = useAppSelector((state) => state.authReducer)

  const schema = Yup.object().shape({
    otp: Yup.number().min(4, 'Must be exactly 5 digits').required(),
  })

  const initialValues = {
    otp: '',
  }

  useEffect(() => {
    if (!campaignId && !otpid) {
      navigate('/error')
    }
  }, [])

  useEffect(() => {
    if (!otpDetails) {
      navigate({
        pathname: '/verify-mobile',
        search: `?campaignId=${campaignDetails._id}`,
      })
    } else if (!campaignDetails) {
      navigate('/error')
    }
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      const payload = {
        country_code: location.state.country_code,
        mobile_no: String(location.state.mobile_no),
        otp: values.otp,
        otp_id: otpid,
      }
      setLoading(true)
      try {
        const {data: auth} = await verifyOtp(payload)
        if (JSON.stringify(auth.data) === '{}') {
          saveAuth(undefined)
          setSubmitting(false)
          setLoading(false)
          ToastMessage(auth?.message, 'error')
        } else {
          saveAuth(auth.data)
          setToken(auth.data.token)
          setUserType('user')
          setSubmitting(false)
          ToastMessage('Otp verfied successfully!', 'success')
          navigate({
            pathname: '/campaign',
            search: `?id=${campaignId}`,
          })
          updateCount(campaignId, {
            action: 'UPDATE_CAMPAIGN_CLICKCOUNT',
            user_id: auth?.data?._id,
          })

          setCurrentUser(auth.data)
        }
      } catch (error: any) {
        setLoading(false)
        ToastMessage('Something went wrong!', 'error')
      }
    },
  })

  return (
    <>
      <div className='container otp-screen'>
        <div className='row d-flex justify-content-center'>
          <div className='col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12'></div>
        </div>
      </div>
      <div
        className='verify-screens'
        style={{backgroundImage: `url(${campaignDetails?.frontend_img})`}}
      >
        <div
          className='user-details-sub-div '
          style={{
            backgroundImage: !campaignDetails?.frontend_img
              ? `url(
              'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/background.png'
            )`
              : `url(${campaignDetails?.frontend_img})`,
          }}
        ></div>
        <div className='sub-div '>
          <div className='text-center heading'>Enter OTP</div>
          <div className='px-10'>
            {' '}
            <form onSubmit={formik.handleSubmit}>
              <div className='form-group mt-15 otp-input'>
                <input type='number' {...formik.getFieldProps('otp')} hidden />
                <OtpInput
                  inputStyle={{
                    border: '1px solid #C8C8C8',
                    width: '35px',
                    height: '35px',
                    fontSize: '15px',
                    color: '#000',
                    fontWeight: '400',
                    caretColor: 'blue',
                    borderRadius: '3px',
                  }}
                  containerStyle='justify-content-between'
                  isInputNum
                  value={formik.values.otp}
                  onChange={(otp) => {
                    formik.setFieldValue('otp', otp)
                  }}
                  numInputs={4}
                />

                {formik.touched.otp && formik.values.otp.length < 4 && (
                  <p className='text-danger px-2 pt-2'>Please enter valid otp</p>
                )}
              </div>
              <div className='d-grid mt-10'>
                <button
                  className='btn btn-primary btn-lg'
                  type='submit'
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!loading && <span className='indicator-label'>Next</span>}
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
        <Footer />
      </div>
    </>
  )
}

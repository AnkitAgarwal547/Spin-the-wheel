import React, {useState} from 'react'
import {toAbsoluteUrl} from '../../../../helpers'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import clsx from 'clsx'
import {userLogin} from '../../../../../app/modules/auth/core/_requests'
import {ToastContainer} from 'react-toastify'
import {useNavigate, useLocation} from 'react-router'

export default function VerifyMobile() {
  const [loading, setLoading] = useState(false)
  const search = useLocation().search
  const campaignId = new URLSearchParams(search).get('campaignId')
  console.log('🚀 ~ file: VerifyMobile.tsx ~ line 14 ~ VerifyMobile ~ search', search)

  const navigate = useNavigate()
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const schema = Yup.object().shape({
    mobile_no: Yup.string()
      .required('required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'to short')
      .max(10, 'to long'),
  })

  const initialValues = {
    mobile_no: '9136035356',
    country_code: '+91',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      console.log('🚀 ~ file: UserAuth.tsx ~ line 28 ~ onSubmit: ~ values', values)
      setLoading(true)
      try {
        const {data} = await userLogin(values.mobile_no.toString(), values.country_code)
        console.log('🚀 ~ file: VerifyMobile.tsx ~ line 35 ~ onSubmit: ~ data', data)
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
      } catch (error: any) {
        setLoading(false)
        ToastMessage('Something went wrong!', 'error')
      }
    },
  })

  return (
    <div className='container'>
      <div className='row d-flex justify-content-center'>
        <div className='col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12'>
          <form onSubmit={formik.handleSubmit}>
            <div className='text-center'>
              <img height='80px' src={toAbsoluteUrl('/media/icons/logo_placeholder.png')} />
            </div>
            <div className='form-group mt-15'>
              <h1 className='fw-normal mb-5'>Mobile Number Verification</h1>
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
                className='btn btn-dark btn-sm'
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
              <ToastContainer />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

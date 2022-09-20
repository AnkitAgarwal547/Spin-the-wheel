import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestPassword} from '../core/_requests'
import {ToastMessage} from '../../../shared/ToastMessage'
import {ToastContainer} from 'react-toastify'

const initialValues = {
  email: '',
  new_password: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  new_password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      requestPassword(values.email, values.new_password)
        .then((resp) => {
          setLoading(false)
          ToastMessage('Password updated successfully', 'success')
          navigate('/auth/login')
        })
        .catch((error) => {
          setLoading(false)
          setSubmitting(false)
          setStatus('The login detail is incorrect')
          if (error.response.data.message) {
            ToastMessage(error.response.data.message, 'error')
          } else {
            ToastMessage('Something went wrong!', 'error')
          }
        })
    },
  })

  return (
    <>
      <form
        className='form w-50 m-auto'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark mb-3'>Forgot Password ?</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className='text-gray-400 fw-bold fs-4'>Enter your email to reset your password.</div>
          {/* end::Link */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
              Sorry, looks like there are some errors detected, please try again.
            </div>
          </div>
        )}

        {hasErrors === false && (
          <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>Sent password reset. Please check your email</div>
          </div>
        )}
        {/* end::Title */}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <input
            type='email'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.email && formik.errors.email},
              {
                'is-valid': formik.touched.email && !formik.errors.email,
              }
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        <div className='fv-row mb-10'>
          <input
            type='password'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('new_password')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.new_password && formik.errors.new_password},
              {
                'is-valid': formik.touched.new_password && !formik.errors.new_password,
              }
            )}
          />
          {formik.touched.new_password && formik.errors.new_password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.new_password}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}
        <ToastContainer />

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button
            type='submit'
            id='kt_password_reset_submit'
            className='btn btn-sm btn-dark me-4'
            disabled={loading || !formik.isValid}
          >
            <div className='d-flex'>
              <span className='indicator-label'>Submit </span>
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </div>
          </button>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-outline-dark btn-sm'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Cancel
            </button>
          </Link>
        </div>
        {/* end::Form group */}
      </form>
    </>
  )
}

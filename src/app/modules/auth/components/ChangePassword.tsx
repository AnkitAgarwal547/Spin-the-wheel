import {useFormik} from 'formik'
import React, {useState} from 'react'
import * as Yup from 'yup'
import {ToastContainer} from 'react-toastify'
import clsx from 'clsx'
import {changePassword} from '../core/_requests'
import {ToastMessage} from '../../../shared/ToastMessage'

export default function ChangePassword() {
  const [loading, setLoading] = useState(false)
  const changePasswordSchema = Yup.object().shape({
    old_password: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Old Password is required'),
    password: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Password is required'),
    new_password: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('New password is required')
      .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
  })

  const initialValues = {
    password: '',
    new_password: '',
    old_password: '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: changePasswordSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const resp = await changePassword({
          old_password: formik.values.old_password,
          new_password: formik.values.new_password,
        })
        setLoading(false)
        ToastMessage(resp.data.message, 'success')
        formik.resetForm()
      } catch (error: any) {
        setSubmitting(false)
        setLoading(false)
        ToastMessage('Something went wrong!', 'error')
      }
    },
  })

  return (
    <div>
      <div className='card-body'>
        <h1 className=''>Change Password</h1>
        <hr />
        <ToastContainer />
        <form
          className='form w-100'
          onSubmit={formik.handleSubmit}
          noValidate
          id='kt_login_signin_form'
        >
          <div className='my-8 row'>
            <div className='col-xxl-4 col-xl-4 col-lg-6 col-md-5 col-sm-5 col-6'>
              <label className='form-label fw-bold'>Create a New Password</label>

              <div className='my-5'>
                <input
                  type='password'
                  id='exampleFormControlInput1'
                  placeholder='Old Password'
                  {...formik.getFieldProps('old_password')}
                  className={clsx(
                    'form-control',
                    {'is-invalid': formik.touched.old_password && formik.errors.old_password},
                    {
                      'is-valid': formik.touched.old_password && !formik.errors.old_password,
                    }
                  )}
                />
                {formik.touched.old_password && formik.errors.old_password && (
                  <div className='fv-plugins-message-container text-danger'>
                    <span role='alert'>{formik.errors.old_password}</span>
                  </div>
                )}
              </div>
              <div className='my-5'>
                <input
                  type='password'
                  id='exampleFormControlInput1'
                  placeholder='Password'
                  {...formik.getFieldProps('password')}
                  className={clsx(
                    'form-control',
                    {'is-invalid': formik.touched.password && formik.errors.password},
                    {
                      'is-valid': formik.touched.password && !formik.errors.password,
                    }
                  )}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='fv-plugins-message-container text-danger'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                )}
              </div>

              <div className='mb-5'>
                <input
                  type='password'
                  id='exampleFormControlInput1'
                  placeholder='Confirm Password'
                  {...formik.getFieldProps('new_password')}
                  className={clsx(
                    'form-control ',
                    {
                      'is-invalid':
                        formik.touched.new_password &&
                        formik.errors.new_password &&
                        formik.values.new_password !== formik.values.password,
                    },
                    {
                      'is-valid':
                        formik.touched.new_password &&
                        !formik.errors.new_password &&
                        formik.values.new_password === formik.values.password,
                    }
                  )}
                />
              </div>
            </div>
            <div className='row my-10'>
              <div className='col-5'>
                <button
                  type='submit'
                  id='kt_sign_in_submit'
                  className='btn btn-sm btn-dark '
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!loading && <span className='indicator-label'>Set Password</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

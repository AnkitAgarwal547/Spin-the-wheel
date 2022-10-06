/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {getUserByToken, login, setToken, setUserType} from '../core/_requests'
import {useAuth} from '../core/Auth'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {ToastMessage} from '../../../shared/ToastMessage'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const {data: auth} = await login(values.email, values.password)
        if (JSON.stringify(auth.data) === '{}') {
          saveAuth(undefined)
          setStatus('The login detail is incorrect')
          setSubmitting(false)
          setLoading(false)
          ToastMessage(auth?.message, 'error')
        } else {
          saveAuth(auth.data)
          setToken(auth.data.token)
          setUserType('admin')
          ToastMessage('Login successful!', 'success')
          setCurrentUser(auth.data)
        }
      } catch (error: any) {
        saveAuth(undefined)
        setStatus('The login detail is incorrect')
        setSubmitting(false)
        setLoading(false)
        ToastMessage('Something went wrong!', 'error')
      }
    },
  })

  return (
    <div className='col-xxl-6 offset-xl-3'>
      <form
        className='form w-100'
        onSubmit={formik.handleSubmit}
        noValidate
        id='kt_login_signin_form'
      >
        <div className='text-center mb-10'>
          <h1 className='text-primary mb-3'>Welcome</h1>
          <h6 className='text-dark mb-3'>Please Login to Admin Dashboard</h6>
        </div>

        <ToastContainer />

        <div className='fv-row mb-12'>
          <input
            placeholder='Enter username or email'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.email && formik.errors.email},
              {
                'is-valid': formik.touched.email && !formik.errors.email,
              }
            )}
            type='email'
            name='email'
            autoComplete='off'
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          )}
        </div>
        <div className='fv-row mb-4'>
          <div className='d-flex justify-content-between mt-n5'></div>
          <input
            type='password'
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.password && formik.errors.password,
              },
              {
                'is-valid': formik.touched.password && !formik.errors.password,
              }
            )}
            placeholder='Enter password'
          />
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>
        <Link to='/auth/forgot-password' className='text-muted fs-6' style={{marginLeft: '5px'}}>
          Forgot Password ?
        </Link>
        <div className='text-center mt-10'>
          <button
            type='submit'
            id='kt_sign_in_submit'
            className='btn btn-lg btn-primary w-100 mb-5'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span className='indicator-label'>Login</span>}
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
  )
}

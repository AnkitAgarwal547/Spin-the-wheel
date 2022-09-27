import clsx from 'clsx'
import React, {useState} from 'react'
import {Col, Form, Row} from 'react-bootstrap'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import * as Yup from 'yup'
import './Terms.scss'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import {useNavigate} from 'react-router'
import {useFormik} from 'formik'
import {TRIGGER_USER_DETAILS} from '../../../../../app/redux/actions/actionTypes'

export default function Terms() {
  const {campaignDetails} = useAppSelector((state) => state.userReducer)

  console.log('🚀 ~ file: terms.tsx ~ line 14 ~ Terms ~ campaignDetails', campaignDetails)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <div className='terms-and-conditions'>
      <div className='user-details-sub-div '></div> {/* <Row className='justify-content-center'> */}
      {/* <Col sm={8} xxl={8} xl={8} lg={8} className='rounded  p-10'> */}
      <div className='sub-div'>
        <div className='text-center heading'>Thanks for Submitting!</div>
        <div className='px-10'></div>
        <div className='logo-wrapper'>
          <img alt='logo' className='logo' src={campaignDetails?.logo_url} />
        </div>
        <div className='text-center px-10'>
          <p className='terms-heading'>Terms & Conditions</p>
          <div className='term-text'>{campaignDetails?.tnc}</div>

          <button className='btn btn-primary btn-sm submit-btn'>Close</button>
        </div>
      </div>
    </div>
  )
}

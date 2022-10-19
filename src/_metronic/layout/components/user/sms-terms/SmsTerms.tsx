import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {Col, Form, Row} from 'react-bootstrap'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import * as Yup from 'yup'
import './SmsTerms.scss'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import {useNavigate} from 'react-router'
import {useAuth} from '../../../../../app/modules/auth'
import {getUserType} from '../../../../../app/modules/auth/core/_requests'
import {useDispatch} from 'react-redux'
import {useReset} from '../../../../../app/shared/hooks/useReset'

export default function SmsTerms() {
  const {campaignDetails} = useAppSelector((state) => state.userReducer)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {logout, currentUser} = useAuth()
  const [handleReset] = useReset()

  const onClose = () => {
    logout()
    navigate(`/verify-mobile?campaignId=${campaignDetails._id}`)
    handleReset()
  }

  // useEffect(() => {
  //   if (currentUser && getUserType() == 'user') {
  //     navigate(`/campaign?id=${campaignDetails._id}`)
  //   }
  // }, [])

  return (
    <div
      className='terms-and-conditions'
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
      ></div>{' '}
      {/* <Row className='justify-content-center'> */}
      {/* <Col sm={8} xxl={8} xl={8} lg={8} className='rounded  p-10'> */}
      <div className='sub-div'>
        <div className='text-center heading'>Terms & Conditions</div>
        <div className='px-10'></div>
        <div className='logo-wrapper'>
          <img alt='logo' className='logo' src={campaignDetails?.logo_url} />
        </div>
        <div className='text-center px-10'>
          <div className='term-text'>{campaignDetails?.tnc}</div>
        </div>
      </div>
    </div>
  )
}

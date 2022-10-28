import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {Col, Form, Row} from 'react-bootstrap'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import * as Yup from 'yup'
import './SmsTerms.scss'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import {useNavigate, useParams} from 'react-router'
import {useAuth} from '../../../../../app/modules/auth'
import {
  getUserCampaignDetailsRequest,
  getUserType,
} from '../../../../../app/modules/auth/core/_requests'
import {useDispatch} from 'react-redux'
import {useReset} from '../../../../../app/shared/hooks/useReset'

export default function SmsTerms() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {logout, currentUser} = useAuth()
  const [handleReset] = useReset()
  const [campaignDetails, setCampaignDetails] = useState<any>()
  const {id} = useParams()

  useEffect(() => {
    // if (currentUser && getUserType() == 'user') {
    //   navigate(`/campaign?id=${campaignId}`)
    // }
    if (id) {
      getUserCampaignDetailsRequest(id)
        .then((resp) => {
          setCampaignDetails(resp.data.data)
        })
        .catch(() => {
          navigate('/error')
        })
    } else {
      navigate('/error')
      // logout()
    }
  }, [])

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
        <div className='text-center heading'>SMS Terms & Conditions</div>
        <div className='px-10'></div>
        <div className='logo-wrapper'>
          <img alt='logo' className='logo' src={campaignDetails?.logo_url} />
        </div>
        <div className='text-center px-10'>
          <div className='term-text'>{campaignDetails?.sms_tnc}</div>
        </div>
      </div>
    </div>
  )
}

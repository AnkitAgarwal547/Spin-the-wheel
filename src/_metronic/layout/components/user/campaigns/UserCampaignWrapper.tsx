import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router'
import {
  getUserCampaignDetailsRequest,
  updateCount,
} from '../../../../../app/modules/auth/core/_requests'
import SpinTheWheel from './campaign-types/SpinTheWheel/SpinTheWheel'
import './UserCampaignWrapper.scss'
import Loader from '../../../../../app/shared/Loader'
import {typeOfCampaigns} from '../../../../../app/modules/campaign/CampaignTable'
import {getThemeStyle} from '../../../../../app/pages/campaign/newCampaign/NewCampaign'
import ReactRouterPrompt from 'react-router-prompt'
import Modal from 'react-bootstrap/Modal'
import {Button} from 'react-bootstrap'
import {useAuth} from '../../../../../app/modules/auth'
import {useAppDispatch} from '../../../../../app/redux/hooks/hooks'
import {
  TRIGGER_CAMPAIGN_DETAILS,
  TRIGGER_PRIZE_DETAILS,
} from '../../../../../app/redux/actions/actionTypes'

export default function UserCampaignWrapper() {
  const search = useLocation().search
  console.log('🚀 ~ file: UserCampaignWrapper.tsx ~ line 16 ~ UserCampaignWrapper ~ search', search)
  const id = new URLSearchParams(search).get('id')
  const [campaignDetails, setCampaignDetails] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()
  const {logout} = useAuth()
  const [reward, setReward] = useState()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (id !== undefined && id !== null && id) {
      setLoading(true)
      getUserCampaignDetailsRequest(id)
        .then((resp) => {
          setLoading(false)
          setCampaignDetails(resp.data.data)
          dispatch({
            type: TRIGGER_CAMPAIGN_DETAILS,
            campaignDetails: resp.data.data,
          })
        })
        .catch(() => {
          setLoading(false)
        })

      updateCount(id, {action: 'UPDATE_CAMPAIGN_CLICKCOUNT'})
    } else {
      console.log('🚀 ~ file: UserCampaignWrapper.tsx ~ line 30 ~ useEffect ~ id', id)
      navigate('/error')
      logout()
    }
  }, [])

  const discardChanges = () => {
    console.log('discraf')
  }

  const navigateToUserDetailsForm = () => {
    console.log(
      '🚀 ~ file: UserCampaignWrapper.tsx ~ line 72 ~ navigateToUserDetailsForm ~ reward',
      reward
    )
    if (reward || reward === 0) {
      navigate('/question')
      dispatch({
        type: TRIGGER_PRIZE_DETAILS,
        prizeDetails: campaignDetails?.winning_values[reward],
      })
    }
  }

  return (
    <>
      {loading ? (
        <Loader size='1rem' />
      ) : (
        <div
          className='user-campaign-spin-wheel'
          style={{
            backgroundImage: `url(${campaignDetails?.backimg})`,
          }}
        >
          <div className='logo-wrapper'>
            <img alt='logo' className='logo' src={campaignDetails?.logo_url} />
          </div>
          <div
            style={{color: campaignDetails?.forecolor}}
            className='text-light text-center my-10 campaign-type'
          >
            {campaignDetails.type === typeOfCampaigns.SCRATCH_THE_CARD
              ? 'Scratch the Card'
              : campaignDetails.type === typeOfCampaigns.SPIN_THE_WHEEL
              ? 'Spin the Wheel'
              : 'Choose the Box'}
          </div>
          {/* <ReactRouterPrompt when={(!isSubmitted && id!==null && id!==undefined)}>
            {({isActive, onConfirm, onCancel}) =>
              isActive && (
                <Modal show={true} onHide={() => {}}>
                  <Modal.Body>Are you sure you want to leave?</Modal.Body>
                  <Modal.Footer>
                    <Button variant='outline-dark' size='sm' onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button
                      size='sm'
                      variant='dark'
                      onClick={() => {
                        navigate({
                          pathname: '/verify-mobile',
                          search: `?campaignId=${id}`,
                        })
                        onConfirm(0)
                        discardChanges()

                        logout()
                      }}
                    >
                      Ok
                    </Button>
                  </Modal.Footer>
                </Modal>
              )
            }
          </ReactRouterPrompt> */}

          {campaignDetails && campaignDetails.type === 'SPIN_THE_WHEEL' && (
            <SpinTheWheel details={campaignDetails} setReward={setReward} />
          )}
          <div className='row justify-content-center my-10'>
            <button
              className='btn btn-block btn-primary  btn-lg col-md-5 col-xxl-3 col-xl-3 col-lg-3 col-sm-5 col-4'
              style={{
                color: campaignDetails?.forecolor,
                backgroundColor: getThemeStyle(campaignDetails.template).buttonBackgroundColor,
                border: `1px solid ${campaignDetails.forecolor}`,
              }}
              onClick={() => {
                navigateToUserDetailsForm()
              }}
            >
              Next
            </button>
          </div>

          {campaignDetails?.banner1_url && (
            <div
              className='banner1'
              style={{
                backgroundImage: `url(${campaignDetails?.banner1_url})`,
              }}
            ></div>
          )}

          {campaignDetails?.banner2_url && (
            <div
              className='banner2'
              style={{
                backgroundImage: `url(${campaignDetails?.banner2_url})`,
              }}
            ></div>
          )}
        </div>
      )}
    </>
  )
}

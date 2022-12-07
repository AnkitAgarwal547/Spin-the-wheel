import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router'
import {
  getUserCampaignDetailsRequest,
  getUserType,
  updateCount,
} from '../../../../../app/modules/auth/core/_requests'
import SpinTheWheel from './campaign-types/SpinTheWheel/SpinTheWheel'
import './UserCampaignWrapper.scss'
import Loader from '../../../../../app/shared/Loader'
import {typeOfCampaigns} from '../../../../../app/modules/campaign/CampaignTable'
import {getThemeStyle, isImage} from '../../../../../app/pages/campaign/newCampaign/NewCampaign'
import ReactRouterPrompt from 'react-router-prompt'
import Modal from 'react-bootstrap/Modal'
import {Button} from 'react-bootstrap'
import {useAuth} from '../../../../../app/modules/auth'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import {
  TRIGGER_CAMPAIGN_DETAILS,
  TRIGGER_PRIZE_DETAILS,
  TRIGGER_PRIZE_INDEX,
} from '../../../../../app/redux/actions/actionTypes'
import {ToastMessage} from '../../../../../app/shared/ToastMessage'
import {ToastContainer} from 'react-toastify'
import {useReset} from '../../../../../app/shared/hooks/useReset'
import ScratchCardWrapper from '../../scratchCard/ScratchCard'
import PickTheBox from './campaign-types/PickTheBox/PickTheBox'
import {Footer} from '../../Footer'

export default function UserCampaignWrapper() {
  const search = useLocation().search
  const id = new URLSearchParams(search).get('id')
  const {campaignDetails, prizeIndex} = useAppSelector((state) => state.userReducer)
  const [loading, setLoading] = useState(false)
  const {currentUser} = useAuth()

  const navigate = useNavigate()
  const {logout} = useAuth()
  const [reward, setReward] = useState(prizeIndex)
  const dispatch = useAppDispatch()
  const [modal, showModal] = useState(false)
  const [prizePopup, setPrizePopup] = useState(prizeIndex || prizeIndex === 0 ? true : false)
  const [handleReset] = useReset()

  const checkIfAlreadyPlayed = () => {
    let index = currentUser?.['play_count'].findIndex((item) => item.campaign_id === id)
    if (index !== -1) {
      if (currentUser?.['play_count'][index]['campaign_id'] === id) {
        if (
          campaignDetails.maxplay_peruser_perday <=
          currentUser?.['play_count'][index]['played_today']
        ) {
          showModal(true)
        }
      }
    }
  }

  useEffect(() => {
    if (id !== undefined && id !== null && id) {
      setLoading(true)
      checkIfAlreadyPlayed()
      getUserCampaignDetailsRequest(id)
        .then((resp) => {
          setLoading(false)
          // setCampaignDetails(resp.data.data)
          dispatch({
            type: TRIGGER_CAMPAIGN_DETAILS,
            campaignDetails: resp.data.data,
          })
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      navigate('/error')
      logout()
    }
  }, [])

  const navigateToUserDetailsForm = () => {
    if (prizeIndex || prizeIndex === 0) {
      navigate('/question')
      dispatch({
        type: TRIGGER_PRIZE_DETAILS,
        prizeDetails: campaignDetails?.winning_values[prizeIndex],
      })
    } else {
      let msg
      {
        campaignDetails.type === typeOfCampaigns.SCRATCH_THE_CARD
          ? (msg = 'Please Scratch The Card')
          : campaignDetails.type === typeOfCampaigns.SPIN_THE_WHEEL
          ? (msg = 'Please Spin The Wheel')
          : (msg = 'Please Choose the Box')
      }
      ToastMessage(msg, 'error')
    }
  }

  const redirectUser = () => {
    showModal(false)
    logout()
    handleReset()
    navigate(`verify-mobile?campaignId=${id}`)
  }

  useEffect(() => {
    if (!currentUser) {
      navigate({
        pathname: '/verify-mobile',
        search: `?campaignId=${campaignDetails._id}`,
      })
    }
  }, [])

  const setPrizeDetails = (reward) => {
    dispatch({
      type: TRIGGER_PRIZE_INDEX,
      prizeIndex: reward,
    })
  }

  return (
    <>
      {loading ? (
        <Loader size='1rem' />
      ) : (
        <div
          className='user-campaign-spin-wheel position-relative'
          style={{
            backgroundImage: `url(${campaignDetails?.backimg})`,
            overflow: campaignDetails.type == typeOfCampaigns.SCRATCH_THE_CARD ? 'hidden' : '',
          }}
        >
          <div className='logo-wrapper'>
            <div
              className='logo'
              style={{backgroundImage: `url(${campaignDetails?.logo_url})`}}
            ></div>
            {/* <img alt='logo' className='logo' src={campaignDetails?.logo_url} /> */}
          </div>
          <div
            style={{color: campaignDetails?.forecolor}}
            className='text-center my-10 campaign-type'
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
          <h1 className='action-message fs-15 text-center'>
            {campaignDetails.type === typeOfCampaigns.SCRATCH_THE_CARD
              ? 'Please Scratch The Card'
              : campaignDetails.type === typeOfCampaigns.SPIN_THE_WHEEL
              ? 'Please Tap On The Wheel'
              : 'Please Choose the Box'}
          </h1>

          {campaignDetails && campaignDetails.type === 'SPIN_THE_WHEEL' && (
            <SpinTheWheel
              details={campaignDetails}
              setReward={(data) => {
                setPrizeDetails(data)
              }}
              userDetails={currentUser}
              prizeIndex={prizeIndex}
            />
          )}
          {campaignDetails && campaignDetails.type === typeOfCampaigns.SCRATCH_THE_CARD && (
            <ScratchCardWrapper
              image={
                isImage(campaignDetails?.prop_color[0])
                  ? campaignDetails?.prop_color[0]
                  : getThemeStyle(campaignDetails.template).scratchCardImage
              }
            />
          )}

          {campaignDetails && campaignDetails.type === typeOfCampaigns.CHOOSE_THE_BOX && (
            <PickTheBox />
          )}

          <div
            className='row justify-content-center my-10 next-btn-div'
            style={{
              paddingBottom: campaignDetails.type === 'SPIN_THE_WHEEL' ? '80px' : '',
            }}
          >
            <button
              className='btn btn-block btn-light next-btn  btn-lg col-md-5 col-xxl-3 col-xl-3 col-lg-3 col-sm-5 col-4'
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
          <Footer />
        </div>
      )}

      <ToastContainer />

      <Modal
        show={modal}
        onHide={() => redirectUser()}
        dialogClassName='modal-90w'
        aria-labelledby='example-custom-modal-styling-title'
        centered
      >
        <Modal.Body className='text-center'>
          <h1>You have already Exceeded the playing limit!</h1>
        </Modal.Body>
      </Modal>

      {/* <Modal show={prizePopup} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>You won</Modal.Title>
        </Modal.Header>
        <Modal.Body>{campaignDetails.winning_values[reward]['label']}</Modal.Body>

      </Modal> */}
    </>
  )
}

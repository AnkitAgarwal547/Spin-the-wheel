import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {
  TRIGGER_ANSWER_DETAILS,
  TRIGGER_CAMPAIGN_DETAILS,
  TRIGGER_END_TIME,
  TRIGGER_IS_ANSWER_CORRECT,
  TRIGGER_MOBILE,
  TRIGGER_OTP,
  TRIGGER_PRIZE_DETAILS,
  TRIGGER_PRIZE_INDEX,
  TRIGGER_QUESTION_DETAILS,
  TRIGGER_SELECTED_BOX_INDEX,
  TRIGGER_START_TIME,
} from '../../redux/actions/actionTypes'

export function useReset() {
  const dispatch = useDispatch()

  const handleReset = () => {
    dispatch({
      type: TRIGGER_MOBILE,
      mobileDetails: '',
    })

    dispatch({
      type: TRIGGER_PRIZE_INDEX,
      prizeIndex: '',
    })
    dispatch({
      type: TRIGGER_OTP,
      otpDetails: '',
    })

    dispatch({
      type: TRIGGER_IS_ANSWER_CORRECT,
      isAnswerCorrect: false,
    })

    dispatch({
      type: TRIGGER_END_TIME,
      endTime: '',
    })

    dispatch({
      type: TRIGGER_START_TIME,
      startTime: '',
    })

    dispatch({
      type: TRIGGER_ANSWER_DETAILS,
      answerDetails: '',
    })

    dispatch({
      type: TRIGGER_PRIZE_DETAILS,
      prizeDetails: '',
    })

    dispatch({
      type: TRIGGER_CAMPAIGN_DETAILS,
      campaignDetails: '',
    })

    dispatch({
      type: TRIGGER_QUESTION_DETAILS,
      questionDetails: '',
    })

    dispatch({
      type: TRIGGER_SELECTED_BOX_INDEX,
      selectedBoxIndex: '',
    })
  }

  return [handleReset]
}

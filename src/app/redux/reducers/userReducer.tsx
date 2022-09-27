import {
  TRIGGER_CAMPAIGN_DETAILS,
  TRIGGER_PRIZE_DETAILS,
  TRIGGER_ANSWER_DETAILS,
  TRIGGER_USER_DETAILS,
  TRIGGER_QUESTION_DETAILS,
  TRIGGER_START_TIME,
  TRIGGER_END_TIME,
} from '../actions/actionTypes'

const initialState = {
  campaignDetails: '',
  userDetails: '',
  questionDetails: '',
  prizeDetails: '',
  answerDetails: '',
  startTime: null,
  endTime: null,
}

const userReducer = function (state = initialState, action) {
  switch (action.type) {
    case TRIGGER_CAMPAIGN_DETAILS: {
      return {
        ...state,
        campaignDetails: action.campaignDetails,
      }
    }

    case TRIGGER_USER_DETAILS: {
      return {
        ...state,
        userDetails: action.userDetails,
      }
    }

    case TRIGGER_QUESTION_DETAILS: {
      return {
        ...state,
        questionDetails: action.questionDetails,
      }
    }

    case TRIGGER_ANSWER_DETAILS: {
      return {
        ...state,
        answerDetails: action.answerDetails,
      }
    }

    case TRIGGER_PRIZE_DETAILS: {
      return {
        ...state,
        prizeDetails: action.prizeDetails,
      }
    }

    case TRIGGER_START_TIME: {
      return {
        ...state,
        startTime: action.startTime,
      }
    }

    case TRIGGER_END_TIME: {
      return {
        ...state,
        endTime: action.endTime,
      }
    }
    default:
      return state
  }
}

export default userReducer

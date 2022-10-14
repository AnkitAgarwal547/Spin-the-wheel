import {
  TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE,
  TRIGGER_CAMPAIGN_TABLE_CURRENT_PAGE,
  TRIGGER_QUESTIONNAIRE_CURRENT_PAGE,
  TRIGGER_SEARCH_KEYWORD,
} from '../actions/actionTypes'

const initialState = {
  campaignDetailsTableCurrentPage: 1,
  questionnaireCurrentPage: 1,
  campaignTableCurrentPage: 1,
}

const paginationReducer = function (state = initialState, action) {
  switch (action.type) {
    case TRIGGER_QUESTIONNAIRE_CURRENT_PAGE: {
      return {
        ...state,
        questionnaireCurrentPage: action.questionnaireCurrentPage,
      }
    }

    case TRIGGER_CAMPAIGN_TABLE_CURRENT_PAGE: {
      return {
        ...state,
        campaignTableCurrentPage: action.campaignTableCurrentPage,
      }
    }

    case TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE: {
      return {
        ...state,
        campaignDetailsTableCurrentPage: action.campaignDetailsTableCurrentPage,
      }
    }

    default:
      return state
  }
}

export default paginationReducer

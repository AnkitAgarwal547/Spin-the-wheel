import {TRIGGER_SEARCH_KEYWORD} from '../actions/actionTypes'

const initialState = {
  searchKey: '',
}

const searchReducer = function (state = initialState, action) {
  switch (action.type) {
    case TRIGGER_SEARCH_KEYWORD: {
      return {
        ...state,
        searchKey: action.searchKey,
      }
    }
    default:
      return state
  }
}

export default searchReducer

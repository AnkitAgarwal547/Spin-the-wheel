import {combineReducers} from 'redux'
import authReducer from './authReducer'
import searchReducer from './searchReducer'
import userReducer from './userReducer'
import questionnaireReducer from './questionnaireReducer'

export const rootReducer = combineReducers({
  authReducer,
  searchReducer,
  userReducer,
  questionnaireReducer
})

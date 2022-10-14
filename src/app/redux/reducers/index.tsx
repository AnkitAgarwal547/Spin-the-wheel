import {combineReducers} from 'redux'
import authReducer from './authReducer'
import searchReducer from './searchReducer'
import userReducer from './userReducer'
import paginationReducer from './paginationReducer'

export const rootReducer = combineReducers({
  authReducer,
  searchReducer,
  userReducer,
  paginationReducer
})

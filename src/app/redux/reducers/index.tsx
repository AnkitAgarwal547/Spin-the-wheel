import {combineReducers} from 'redux'
import authReducer from './authReducer'
import searchReducer from './searchReducer'
import userReducer from './userReducer'
export const rootReducer = combineReducers({
  authReducer,
  searchReducer,
  userReducer,
})

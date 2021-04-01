import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/user'

export default configureStore({
  reducer: {
    user: userReducer
  }
})

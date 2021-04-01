import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/user'
import eventsReducer from './slice/events'

export default configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer
  }
})

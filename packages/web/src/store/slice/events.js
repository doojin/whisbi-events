import { createSlice } from '@reduxjs/toolkit'

export const getEvents = state => state.events.items

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: []
  },
  reducers: {
    setEvents (state, action) {
      state.items = action.payload
    }
  }
})

export const { setEvents } = eventsSlice.actions

export default eventsSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

export const getUser = state => state.user.value

export const isAuthenticated = state => state.user.value !== null

export const getUserToken = state => state.user.value !== null ? state.user.value.token.value : null

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: null
  },
  reducers: {
    setUser (state, action) {
      localStorage.setItem('user', JSON.stringify(action.payload))
      state.value = action.payload
    },
    cleanUser (state) {
      localStorage.removeItem('user')
      state.value = null
    }
  }
})

export const { setUser, cleanUser } = userSlice.actions

export default userSlice.reducer

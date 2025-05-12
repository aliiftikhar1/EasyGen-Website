import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload
      state.user = user
      state.token = access
      state.refreshToken = refresh
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectAccessToken = (state) => state.auth.token
export const selectRefreshToken = (state) => state.auth.refreshToken
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

export default authSlice.reducer 
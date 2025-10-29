import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
  } as AuthState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    getToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    deleteToken(state) {
      state.token = null
    },
  },
})

export const { setToken, getToken, deleteToken } = authSlice.actions
export default authSlice.reducer

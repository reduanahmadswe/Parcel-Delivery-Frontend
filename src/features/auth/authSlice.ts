import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types'

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
            state.error = null
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
            state.token = action.payload.token
            state.error = null
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.token = null
            state.error = action.payload
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.loading = false
            state.error = null
        },
        clearError: (state) => {
            state.error = null
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },
    },
})

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
    updateUser,
} = authSlice.actions

export default authSlice.reducer

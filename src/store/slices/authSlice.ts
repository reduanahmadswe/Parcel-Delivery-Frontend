import { TokenManager } from '@/lib/TokenManager';
import { User } from '@/types/GlobalTypeDefinitions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

// Initial state
const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // Login success
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
            const { user, token, refreshToken } = action.payload;
            state.user = user;
            state.token = token;
            state.refreshToken = refreshToken || null;
            state.isAuthenticated = true;
            state.loading = false;
            TokenManager.setTokens(token, refreshToken);
            // Ensure user info is also saved
            if (typeof window !== 'undefined') {
                localStorage.setItem('userData', JSON.stringify(user));
            }
        },

        // Login failure
        loginFailure: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;

            // Clear tokens from storage
            TokenManager.clearTokens();
        },

        // Update user profile
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },

        // Refresh token success
        refreshTokenSuccess: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            // Update token in storage
            TokenManager.setTokens(action.payload, state.refreshToken || undefined);
        },

        // Logout
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            TokenManager.clearTokens();
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userData');
            }
        },

        // Restore from storage (used by redux-persist)
        restoreAuth: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
            const { user, token, refreshToken } = action.payload;

            // Validate token exists in storage
            const storedToken = TokenManager.getAccessToken();
            if (storedToken && storedToken === token) {
                state.user = user;
                state.token = token;
                state.refreshToken = refreshToken || null;
                state.isAuthenticated = true;
            } else {
                // Token mismatch or doesn't exist, clear state
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                TokenManager.clearTokens();
            }
            state.loading = false;
        },
    },
});

export const {
    setLoading,
    loginSuccess,
    loginFailure,
    updateUser,
    refreshTokenSuccess,
    logout,
    restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;

// Type-safe selectors for persisted state
export const selectCurrentUserSafe = (state: unknown) => {
    if (typeof state === 'object' && state !== null && 'auth' in state) {
        const authState = (state as { auth: unknown }).auth;
        if (typeof authState === 'object' && authState !== null && 'user' in authState) {
            return (authState as AuthState).user;
        }
    }
    return null;
};

export const selectIsAuthenticatedSafe = (state: unknown) => {
    if (typeof state === 'object' && state !== null && 'auth' in state) {
        const authState = (state as { auth: unknown }).auth;
        if (typeof authState === 'object' && authState !== null && 'isAuthenticated' in authState) {
            return (authState as AuthState).isAuthenticated;
        }
    }
    return false;
};

export const selectAuthLoadingSafe = (state: unknown) => {
    if (typeof state === 'object' && state !== null && 'auth' in state) {
        const authState = (state as { auth: unknown }).auth;
        if (typeof authState === 'object' && authState !== null && 'loading' in authState) {
            return (authState as AuthState).loading;
        }
    }
    return false;
};

export const selectTokenSafe = (state: unknown) => {
    if (typeof state === 'object' && state !== null && 'auth' in state) {
        const authState = (state as { auth: unknown }).auth;
        if (typeof authState === 'object' && authState !== null && 'token' in authState) {
            return (authState as AuthState).token;
        }
    }
    return null;
};

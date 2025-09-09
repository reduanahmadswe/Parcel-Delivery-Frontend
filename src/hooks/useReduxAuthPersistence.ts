/* eslint-disable @typescript-eslint/no-explicit-any */
import { TokenManager } from '@/lib/TokenManager';
import { useGetCurrentUserQuery } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    loginSuccess,
    logout,
    setLoading
} from '@/store/slices/authSlice';
import { useEffect } from 'react';

export function useReduxAuthPersistence() {
    const dispatch = useAppDispatch();

    // Safely access auth state
    const isAuthenticated = useAppSelector((state) => {
        if ('auth' in state && state.auth && typeof state.auth === 'object') {
            return (state.auth as any).isAuthenticated ?? false;
        }
        return false;
    });

    const reduxToken = useAppSelector((state) => {
        if ('auth' in state && state.auth && typeof state.auth === 'object') {
            return (state.auth as any).token ?? null;
        }
        return null;
    });

    // Get current user query - only run if we have a token
    const storageToken = TokenManager.getAccessToken();
    const hasToken = reduxToken || storageToken;

    const {
        data: userData,
        error: userError,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useGetCurrentUserQuery(undefined, {
        skip: !hasToken, // Skip if no token available
    });

    // Initialize auth state from storage on mount - only run once on app startup
    useEffect(() => {
        const initializeAuth = () => {
            dispatch(setLoading(true));

            // Only clear authentication data on first app load, not on subsequent renders
            const hasBeenInitialized = sessionStorage.getItem('persistenceInitialized');

            if (!hasBeenInitialized) {
                console.log("Clearing authentication data on startup from persistence hook (first time only)");

                TokenManager.clearTokens();
                localStorage.removeItem('userData');
                dispatch(logout());

                // Mark as initialized so this doesn't run again during the session
                sessionStorage.setItem('persistenceInitialized', 'true');
            }

            dispatch(setLoading(false));

            // If you want to restore authentication, uncomment the code below:
            /*
            const token = TokenManager.getAccessToken();
            const refreshToken = TokenManager.getRefreshToken();
            const cachedUserStr = localStorage.getItem('userData');

            if (token && cachedUserStr) {
                try {
                    const cachedUser = JSON.parse(cachedUserStr);

                    // Restore auth state immediately for better UX
                    dispatch(loginSuccess({
                        user: cachedUser,
                        token,
                        refreshToken: refreshToken || undefined,
                    }));
    // Initialize auth state from storage on mount - only run once on app startup
    useEffect(() => {
        const initializeAuth = () => {
            dispatch(setLoading(true));

            // Only clear authentication data on first app load, not on subsequent renders
            const hasBeenInitialized = sessionStorage.getItem('persistenceInitialized');
            
            if (!hasBeenInitialized) {
                console.log("Clearing authentication data on startup from persistence hook (first time only)");
                
                TokenManager.clearTokens();
                localStorage.removeItem('userData');
                dispatch(logout());
                
                // Mark as initialized so this doesn't run again during the session
                sessionStorage.setItem('persistenceInitialized', 'true');
            }

            dispatch(setLoading(false));

            // If you want to restore authentication, uncomment the code below:
            /*
            const token = TokenManager.getAccessToken();
            const refreshToken = TokenManager.getRefreshToken();
            const cachedUserStr = localStorage.getItem('userData');

            if (token && cachedUserStr) {
                try {
                    const cachedUser = JSON.parse(cachedUserStr);

                    // Restore auth state immediately for better UX
                    dispatch(loginSuccess({
                        user: cachedUser,
                        token,
                        refreshToken: refreshToken || undefined,
                    }));
                } catch (error) {
                    console.error('Failed to parse cached user data:', error);
                    // Clear invalid cached data
                    localStorage.removeItem('userData');
                    TokenManager.clearTokens();
                }
            } else if (!token) {
                // No token, ensure we're logged out
                dispatch(logout());
            }

            dispatch(setLoading(false));
            */
        };

        initializeAuth();
    }, [dispatch]);

    // Handle user data from API
    useEffect(() => {
        if (userData?.data && hasToken) {
            // Update user data in Redux and cache
            const user = userData.data;
            const token = TokenManager.getAccessToken();
            const refreshToken = TokenManager.getRefreshToken();

            if (token) {
                dispatch(loginSuccess({
                    user,
                    token,
                    refreshToken: refreshToken || undefined,
                }));

                // Cache user data in localStorage
                localStorage.setItem('userData', JSON.stringify(user));
            }
        }
    }, [userData, dispatch, hasToken]);

    // Handle authentication errors
    useEffect(() => {
        if (isUserError && userError) {
            console.error('User authentication error:', userError);

            // Check if it's a 401/403 error
            if ('status' in userError && (userError.status === 401 || userError.status === 403)) {
                // Token is invalid, logout
                dispatch(logout());
                localStorage.removeItem('userData');

                // Redirect to login if not already there
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
    }, [isUserError, userError, dispatch]);

    // Handle localStorage changes for multi-tab support
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'accessToken') {
                if (!event.newValue) {
                    // Token was removed in another tab
                    dispatch(logout());
                } else if (!isAuthenticated) {
                    // Token was added in another tab, re-initialize
                    const token = event.newValue;
                    const refreshToken = TokenManager.getRefreshToken();
                    const cachedUserStr = localStorage.getItem('userData');

                    if (cachedUserStr) {
                        try {
                            const cachedUser = JSON.parse(cachedUserStr);
                            dispatch(loginSuccess({
                                user: cachedUser,
                                token,
                                refreshToken: refreshToken || undefined,
                            }));
                        } catch (error) {
                            console.error('Failed to parse user data from storage:', error);
                        }
                    }
                }
            }
        };

        // Handle page visibility change
        const handleVisibilityChange = () => {
            if (!document.hidden && isAuthenticated) {
                // Page became visible and we have a user, verify token is still valid
                const token = TokenManager.getAccessToken();
                if (!token) {
                    // Token was cleared while page was hidden
                    dispatch(logout());
                    localStorage.removeItem('userData');
                }
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            document.addEventListener('visibilitychange', handleVisibilityChange);

            return () => {
                window.removeEventListener('storage', handleStorageChange);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, [dispatch, isAuthenticated]);

    return {
        isLoading: isUserLoading,
        isAuthenticated,
        hasToken: !!hasToken,
    };
}

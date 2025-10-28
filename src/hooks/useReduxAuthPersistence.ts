/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { TokenManager } from '@/services/TokenManager';
import { useGetCurrentUserQuery } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginSuccess, logout, setLoading } from '@/store/slices/authSlice';

export function useReduxAuthPersistence() {
    const dispatch = useAppDispatch();

    // Safely access auth state
    const isAuthenticated = useAppSelector((state: any) => {
        if ('auth' in state && state.auth && typeof state.auth === 'object') {
            return (state.auth as any).isAuthenticated ?? false;
        }
        return false;
    });

    const reduxToken = useAppSelector((state: any) => {
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
            // Do not forcibly clear tokens on first load — this caused a race where
            // another persistence hook could wipe state after a fresh login.
            // Instead, restore auth only when both a token and cached user are present.
            dispatch(setLoading(true));

            const token = TokenManager.getAccessToken();
            const refreshToken = TokenManager.getRefreshToken();
            const cachedUserStr = localStorage.getItem('userData');

            if (token && cachedUserStr) {
                try {
                    const cachedUser = JSON.parse(cachedUserStr);
                    // Restore auth state immediately for better UX
                    dispatch(
                        loginSuccess({
                            user: cachedUser,
                            token,
                            refreshToken: refreshToken || undefined,
                        })
                    );
                } catch (error) {
                    // Clear invalid cached data
                    localStorage.removeItem('userData');
                    TokenManager.clearTokens();
                    dispatch(logout());
                }
            }

            dispatch(setLoading(false));
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
                dispatch(
                    loginSuccess({
                        user,
                        token,
                        refreshToken: refreshToken || undefined,
                    })
                );

                // Cache user data in localStorage
                localStorage.setItem('userData', JSON.stringify(user));
            }
        }
    }, [userData, dispatch, hasToken]);

    // Handle authentication errors
    useEffect(() => {
        if (isUserError && userError) {
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
                    const token = event.newValue as string;
                    const refreshToken = TokenManager.getRefreshToken();
                    const cachedUserStr = localStorage.getItem('userData');

                    if (cachedUserStr) {
                        try {
                            const cachedUser = JSON.parse(cachedUserStr);
                            dispatch(
                                loginSuccess({
                                    user: cachedUser,
                                    token,
                                    refreshToken: refreshToken || undefined,
                                })
                            );
                        } catch (error) {
                            // Failed to parse user data from storage
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

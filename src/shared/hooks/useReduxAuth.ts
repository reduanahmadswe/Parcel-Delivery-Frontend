"use client";

import {
    useGetCurrentUserQuery,
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation
} from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    AuthState,
    loginSuccess,
    logout as logoutAction,
    setLoading,
    updateUser
} from '@/store/slices/authSlice';
import { User } from '@/types/GlobalTypeDefinitions';
import toast from 'react-hot-toast';
import { useReduxAuthPersistence } from './useReduxAuthPersistence';

interface AuthError {
    data?: {
        message?: string;
    };
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "sender" | "receiver";
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export function useReduxAuth() {
    const dispatch = useAppDispatch();

    // Use auth persistence hook
    const { isLoading: persistenceLoading } = useReduxAuthPersistence();

    // Get state from Redux store
    const user = useAppSelector((state) => {
        if ('auth' in state && state.auth && typeof state.auth === 'object') {
            return (state.auth as AuthState).user;
        }
        return null;
    });

    const isAuthenticated = useAppSelector((state) => {
        if ('auth' in state && state.auth && typeof state.auth === 'object') {
            return (state.auth as AuthState).isAuthenticated ?? false;
        }
        return false;
    });

    const authLoading = useAppSelector((state) => {
        if ('auth' in state && state.auth && typeof state.auth === 'object') {
            return (state.auth as AuthState).loading ?? false;
        }
        return false;
    });

    // RTK Query mutations
    const [loginMutation] = useLoginMutation();
    const [registerMutation] = useRegisterMutation();
    const [logoutMutation] = useLogoutMutation();

    // Get current user query for refresh
    const { refetch: refetchUser } = useGetCurrentUserQuery(undefined, {
        skip: !isAuthenticated,
    });

    // Login function
    const login = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; user?: User }> => {
        try {
            dispatch(setLoading(true));

            const result = await loginMutation({ email, password }).unwrap();

            if (result.success && result.data) {
                const { user: userData, accessToken, refreshToken } = result.data;

                // Dispatch login success to Redux
                dispatch(loginSuccess({
                    user: userData,
                    token: accessToken,
                    refreshToken,
                }));

                // Cache user in localStorage
                localStorage.setItem('userData', JSON.stringify(userData));

                toast.success("Login successful");
                return { success: true, user: userData };
            }

            throw new Error('Login failed');
        } catch (error: unknown) {
            dispatch(setLoading(false));
            const authError = error as AuthError;
            const message = authError?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false };
        }
    };

    // Register function
    const register = async (userData: RegisterData): Promise<boolean> => {
        try {
            dispatch(setLoading(true));

            await registerMutation(userData).unwrap();

            dispatch(setLoading(false));
            toast.success("Registration successful! Please log in.");
            return true;
        } catch (error: unknown) {
            dispatch(setLoading(false));
            const authError = error as AuthError;
            const message = authError?.data?.message || 'Registration failed';
            toast.error(message);
            return false;
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            // Call API logout (don't wait for it)
            logoutMutation().catch((error) => {
                console.error('Logout API error:', error);
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local state
            dispatch(logoutAction());
            localStorage.removeItem('userData');
            toast.success("Logged out successfully");
        }
    };

    // Refresh user function
    const refreshUser = async (): Promise<void> => {
        try {
            const result = await refetchUser();
            if (result.data?.data) {
                dispatch(updateUser(result.data.data));
                localStorage.setItem('userData', JSON.stringify(result.data.data));
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            // If refresh fails, clear everything
            dispatch(logoutAction());
            localStorage.removeItem('userData');
        }
    };

    return {
        user,
        loading: authLoading || persistenceLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
    };
}


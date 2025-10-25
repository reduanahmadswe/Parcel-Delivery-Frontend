import { TokenManager } from '@/services/TokenManager';
import { useEffect } from 'react';

/**
 * Hook to ensure user authentication persists across browser refreshes
 * This hook helps maintain login state by checking for stored tokens
 */
export function useAuthPersistence() {
    useEffect(() => {
        // Check if we have tokens but no user data
        const hasToken = TokenManager.hasValidTokens();

        if (hasToken) {
            // Tokens exist, but we need to verify them with the server
            // This is handled by the AuthContext checkAuth function
        }
    }, []);
}

/**
 * Hook to handle cleanup when user explicitly logs out
 */
export function useAuthCleanup() {
    const cleanupAuth = () => {
        TokenManager.clearTokens();

        // Clear any other auth-related data
        if (typeof window !== 'undefined') {
            // Clear any cached user data
            localStorage.removeItem('userData');
            sessionStorage.clear();

            // Reload to clear any remaining state
            window.location.reload();
        }
    };

    return { cleanupAuth };
}


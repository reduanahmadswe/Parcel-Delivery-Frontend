// Utility to manage authentication state and prevent unwanted clearing
export class AuthStateManager {
    private static readonly AUTH_INITIALIZED_KEY = 'authStateInitialized';
    private static readonly SESSION_ACTIVE_KEY = 'sessionActive';

    /**
     * Check if this is the first app load in the session
     */
    static isFirstLoad(): boolean {
        return !sessionStorage.getItem(this.AUTH_INITIALIZED_KEY);
    }

    /**
     * Mark that authentication has been initialized
     */
    static markAsInitialized(): void {
        sessionStorage.setItem(this.AUTH_INITIALIZED_KEY, 'true');
    }

    /**
     * Check if user has an active session (logged in)
     */
    static hasActiveSession(): boolean {
        return sessionStorage.getItem(this.SESSION_ACTIVE_KEY) === 'true';
    }

    /**
     * Mark session as active (after successful login)
     */
    static markSessionActive(): void {
        sessionStorage.setItem(this.SESSION_ACTIVE_KEY, 'true');
    }

    /**
     * Clear session (on logout)
     */
    static clearSession(): void {
        sessionStorage.removeItem(this.SESSION_ACTIVE_KEY);
    }

    /**
     * Should we clear authentication data?
     * Only clear if it's the first load AND there's no active session
     */
    static shouldClearAuth(): boolean {
        return this.isFirstLoad() && !this.hasActiveSession();
    }
}


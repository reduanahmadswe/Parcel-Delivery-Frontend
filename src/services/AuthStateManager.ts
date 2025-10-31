
export class AuthStateManager {
    private static readonly AUTH_INITIALIZED_KEY = 'authStateInitialized';
    private static readonly SESSION_ACTIVE_KEY = 'sessionActive';

    static isFirstLoad(): boolean {
        return !sessionStorage.getItem(this.AUTH_INITIALIZED_KEY);
    }

    static markAsInitialized(): void {
        sessionStorage.setItem(this.AUTH_INITIALIZED_KEY, 'true');
    }

    static isInitialized(): boolean {
        return sessionStorage.getItem(this.AUTH_INITIALIZED_KEY) === 'true';
    }

    static hasActiveSession(): boolean {
        return sessionStorage.getItem(this.SESSION_ACTIVE_KEY) === 'true';
    }

    static markSessionActive(): void {
        sessionStorage.setItem(this.SESSION_ACTIVE_KEY, 'true');
    }

    static clearSession(): void {
        sessionStorage.removeItem(this.SESSION_ACTIVE_KEY);
    }

    static shouldClearAuth(): boolean {
        return this.isFirstLoad() && !this.hasActiveSession();
    }
}


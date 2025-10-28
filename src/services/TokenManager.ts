import Cookies from 'js-cookie';

export class TokenManager {
    private static ACCESS_TOKEN_KEY = 'accessToken';
    private static REFRESH_TOKEN_KEY = 'refreshToken';
    // Timestamp key to help avoid race-condition clears right after a token is set
    private static TOKEN_SET_AT_KEY = 'tokenSetAt';

    // Set tokens with localStorage (for cross-domain scenarios)
    static setTokens(accessToken: string, refreshToken?: string) {
        try {
            // Debug: log token set events to help trace persistence/race issues
            try {
                // Avoid leaking token value in logs in production
                if (typeof window !== 'undefined') {
                    console.debug('[TokenManager] setTokens called');
                }
            } catch (err) {}
            // ✅ Primary: Store in localStorage (works cross-domain)
            if (typeof window !== 'undefined') {
                localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
                
                if (refreshToken) {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
                }
                // Record when tokens were set to help avoid accidental clears immediately after login
                try {
                    localStorage.setItem(this.TOKEN_SET_AT_KEY, String(Date.now()));
                } catch (e) {
                    // ignore
                }
            }

            // Optional: Also try cookies (but won't work cross-domain on Render)
            try {
                Cookies.set(this.ACCESS_TOKEN_KEY, accessToken, {
                    expires: 7,
                    secure: true,
                    sameSite: 'none'
                });

                if (refreshToken) {
                    Cookies.set(this.REFRESH_TOKEN_KEY, refreshToken, {
                        expires: 30,
                        secure: true,
                        sameSite: 'none'
                    });
                }
            } catch (cookieError) {
                // Expected for cross-domain
            }
        } catch (error) {
            // Token storage failed
        }
    }

    // Get access token from localStorage (primary) or cookies (fallback)
    static getAccessToken(): string | null {
        try {
            // ✅ Primary: Try localStorage first (works cross-domain)
            if (typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
                if (localToken) {
                    return localToken;
                }
            }

            // Fallback: Try cookies (won't work cross-domain but try anyway)
            const cookieToken = Cookies.get(this.ACCESS_TOKEN_KEY);
            if (cookieToken) {
                // If found in cookie, sync to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem(this.ACCESS_TOKEN_KEY, cookieToken);
                }
                return cookieToken;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    // Get refresh token from localStorage (primary) or cookies (fallback)
    static getRefreshToken(): string | null {
        try {
            // ✅ Primary: Try localStorage first (works cross-domain)
            if (typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
                if (localToken) {
                    return localToken;
                }
            }

            // Fallback: Try cookies (won't work cross-domain but try anyway)
            const cookieToken = Cookies.get(this.REFRESH_TOKEN_KEY);
            if (cookieToken) {
                // If found in cookie, sync to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, cookieToken);
                }
                return cookieToken;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    // Clear all tokens
    static clearTokens() {
        try {
            // Debug: log token clear events to help trace who is clearing tokens
            try {
                if (typeof window !== 'undefined') {
                    // Use debug level logging and avoid allocating a new Error for stack traces
                    console.debug('[TokenManager] clearTokens called');
                    // Temporary: trace the call stack to help debug unexpected clears
                    // Remove this once we identify the root cause
                    try {
                        // eslint-disable-next-line no-console
                        console.trace('[TokenManager] clearTokens stack trace');
                    } catch (e) {
                        // ignore
                    }
                }
            } catch (err) {}

            // If tokens were set very recently, skip clearing to avoid races where
            // a background check (or failed refresh) fires immediately after a successful login.
            try {
                if (typeof window !== 'undefined') {
                    const ts = localStorage.getItem(this.TOKEN_SET_AT_KEY);
                    if (ts) {
                        const then = parseInt(ts, 10);
                        if (!isNaN(then) && Date.now() - then < 2000) {
                            console.debug('[TokenManager] skip clearing tokens: recent set detected');
                            return;
                        }
                    }
                }
            } catch (e) {
                // ignore parsing errors and proceed to clear
            }
            // Remove from cookies
            Cookies.remove(this.ACCESS_TOKEN_KEY);
            Cookies.remove(this.REFRESH_TOKEN_KEY);

            // Remove from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem(this.ACCESS_TOKEN_KEY);
                localStorage.removeItem(this.REFRESH_TOKEN_KEY);
                localStorage.removeItem('userData'); // Also clear cached user data
                try {
                    localStorage.removeItem(this.TOKEN_SET_AT_KEY);
                } catch (e) {
                    // ignore
                }
            }
        } catch (error) {
            // Failed to clear tokens
        }
    }

    // Check if user has valid tokens
    static hasValidTokens(): boolean {
        const accessToken = this.getAccessToken();
        return !!accessToken;
    }
}


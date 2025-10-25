import Cookies from 'js-cookie';
import { IS_PROD } from '../constants/config';

export class TokenManager {
    private static ACCESS_TOKEN_KEY = 'accessToken';
    private static REFRESH_TOKEN_KEY = 'refreshToken';

    // Set tokens with localStorage (for cross-domain scenarios)
    static setTokens(accessToken: string, refreshToken?: string) {
        try {
            // ✅ Primary: Store in localStorage (works cross-domain)
            if (typeof window !== 'undefined') {
                localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
                if (refreshToken) {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
                }
                console.log("✅ Tokens stored in localStorage");
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
                console.warn("⚠️ Could not set cookies (expected for cross-domain):", cookieError);
            }
        } catch (error) {
            console.error('Failed to store tokens:', error);
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
            console.error('Failed to get access token:', error);
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
            console.error('Failed to get refresh token:', error);
            return null;
        }
    }

    // Clear all tokens
    static clearTokens() {
        try {
            // Remove from cookies
            Cookies.remove(this.ACCESS_TOKEN_KEY);
            Cookies.remove(this.REFRESH_TOKEN_KEY);

            // Remove from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem(this.ACCESS_TOKEN_KEY);
                localStorage.removeItem(this.REFRESH_TOKEN_KEY);
                localStorage.removeItem('userData'); // Also clear cached user data
            }
        } catch (error) {
            console.error('Failed to clear tokens:', error);
        }
    }

    // Check if user has valid tokens
    static hasValidTokens(): boolean {
        const accessToken = this.getAccessToken();
        return !!accessToken;
    }
}


import Cookies from 'js-cookie';
import { IS_PROD } from '../constants/config';

export class TokenManager {
    private static ACCESS_TOKEN_KEY = 'accessToken';
    private static REFRESH_TOKEN_KEY = 'refreshToken';

    // Set tokens with both localStorage and cookies for better persistence
    static setTokens(accessToken: string, refreshToken?: string) {
        try {
            // Store in cookies (primary)
            // ✅ Important: Use 'none' for cross-site cookies in production
            Cookies.set(this.ACCESS_TOKEN_KEY, accessToken, {
                expires: 7, // 7 days
                secure: true, // Always use secure in production
                sameSite: 'none' // Allow cross-site cookies for different domains
            });

            if (refreshToken) {
                Cookies.set(this.REFRESH_TOKEN_KEY, refreshToken, {
                    expires: 30, // 30 days
                    secure: true, // Always use secure in production
                    sameSite: 'none' // Allow cross-site cookies for different domains
                });
            }

            // Also store in localStorage as backup
            if (typeof window !== 'undefined') {
                localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
                if (refreshToken) {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
                }
            }
        } catch (error) {
            console.error('Failed to store tokens:', error);
        }
    }

    // Get access token from cookies or localStorage
    static getAccessToken(): string | null {
        try {
            // First try cookies
            let token = Cookies.get(this.ACCESS_TOKEN_KEY);

            // Fallback to localStorage
            if (!token && typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
                if (localToken) {
                    token = localToken;
                    // If found in localStorage, restore to cookies
                    Cookies.set(this.ACCESS_TOKEN_KEY, localToken, { expires: 7 });
                }
            }

            return token || null;
        } catch (error) {
            console.error('Failed to get access token:', error);
            return null;
        }
    }

    // Get refresh token from cookies or localStorage
    static getRefreshToken(): string | null {
        try {
            // First try cookies
            let token = Cookies.get(this.REFRESH_TOKEN_KEY);

            // Fallback to localStorage
            if (!token && typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
                if (localToken) {
                    token = localToken;
                    // If found in localStorage, restore to cookies
                    Cookies.set(this.REFRESH_TOKEN_KEY, localToken, { expires: 30 });
                }
            }

            return token || null;
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


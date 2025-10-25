import Cookies from 'js-cookie';

export class TokenManager {
    private static ACCESS_TOKEN_KEY = 'accessToken';
    private static REFRESH_TOKEN_KEY = 'refreshToken';

    // Set tokens with localStorage (for cross-domain scenarios)
    static setTokens(accessToken: string, refreshToken?: string) {
        try {
            console.log('💾 TokenManager.setTokens called with:', {
                hasAccessToken: !!accessToken,
                accessTokenPreview: accessToken ? accessToken.substring(0, 30) + '...' : 'NONE',
                hasRefreshToken: !!refreshToken,
                refreshTokenPreview: refreshToken ? refreshToken.substring(0, 30) + '...' : 'NONE',
            });

            // ✅ Primary: Store in localStorage (works cross-domain)
            if (typeof window !== 'undefined') {
                localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
                console.log('✅ Access token stored in localStorage');
                
                if (refreshToken) {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
                    console.log('✅ Refresh token stored in localStorage');
                } else {
                    console.warn('⚠️ No refresh token provided to setTokens');
                }

                // Verify storage immediately
                const storedAccess = localStorage.getItem(this.ACCESS_TOKEN_KEY);
                const storedRefresh = localStorage.getItem(this.REFRESH_TOKEN_KEY);
                console.log('🔍 Verification - Tokens in localStorage:', {
                    accessToken: storedAccess ? storedAccess.substring(0, 30) + '...' : 'NOT FOUND',
                    refreshToken: storedRefresh ? storedRefresh.substring(0, 30) + '...' : 'NOT FOUND',
                });
            } else {
                console.error('❌ Window is undefined - cannot access localStorage');
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
                console.log('✅ Tokens also stored in cookies');
            } catch (cookieError) {
                console.warn("⚠️ Could not set cookies (expected for cross-domain):", cookieError);
            }
        } catch (error) {
            console.error('❌ Failed to store tokens:', error);
        }
    }

    // Get access token from localStorage (primary) or cookies (fallback)
    static getAccessToken(): string | null {
        try {
            // ✅ Primary: Try localStorage first (works cross-domain)
            if (typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
                if (localToken) {
                    console.log('✅ Access token retrieved from localStorage:', localToken.substring(0, 30) + '...');
                    return localToken;
                } else {
                    console.warn('⚠️ No access token found in localStorage');
                }
            }

            // Fallback: Try cookies (won't work cross-domain but try anyway)
            const cookieToken = Cookies.get(this.ACCESS_TOKEN_KEY);
            if (cookieToken) {
                console.log('✅ Access token retrieved from cookie (syncing to localStorage)');
                // If found in cookie, sync to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem(this.ACCESS_TOKEN_KEY, cookieToken);
                }
                return cookieToken;
            }

            console.warn('⚠️ No access token found in localStorage or cookies');
            return null;
        } catch (error) {
            console.error('❌ Failed to get access token:', error);
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
                    console.log('✅ Refresh token retrieved from localStorage:', localToken.substring(0, 30) + '...');
                    return localToken;
                } else {
                    console.warn('⚠️ No refresh token found in localStorage');
                }
            }

            // Fallback: Try cookies (won't work cross-domain but try anyway)
            const cookieToken = Cookies.get(this.REFRESH_TOKEN_KEY);
            if (cookieToken) {
                console.log('✅ Refresh token retrieved from cookie (syncing to localStorage)');
                // If found in cookie, sync to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, cookieToken);
                }
                return cookieToken;
            }

            console.warn('⚠️ No refresh token found in localStorage or cookies');
            return null;
        } catch (error) {
            console.error('❌ Failed to get refresh token:', error);
            return null;
        }
    }

    // Clear all tokens
    static clearTokens() {
        try {
            console.log('🗑️ Clearing all tokens...');
            
            // Remove from cookies
            Cookies.remove(this.ACCESS_TOKEN_KEY);
            Cookies.remove(this.REFRESH_TOKEN_KEY);

            // Remove from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem(this.ACCESS_TOKEN_KEY);
                localStorage.removeItem(this.REFRESH_TOKEN_KEY);
                localStorage.removeItem('userData'); // Also clear cached user data
                console.log('✅ Tokens cleared from localStorage and cookies');
            }
        } catch (error) {
            console.error('❌ Failed to clear tokens:', error);
        }
    }

    // Check if user has valid tokens
    static hasValidTokens(): boolean {
        const accessToken = this.getAccessToken();
        const hasTokens = !!accessToken;
        console.log('🔍 hasValidTokens:', hasTokens);
        return hasTokens;
    }
}


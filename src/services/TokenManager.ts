import Cookies from 'js-cookie';

export class TokenManager {
    private static ACCESS_TOKEN_KEY = 'accessToken';
    private static REFRESH_TOKEN_KEY = 'refreshToken';
    
    private static TOKEN_SET_AT_KEY = 'tokenSetAt';

    static setTokens(accessToken: string, refreshToken?: string) {
        try {
            
            try {
                
                if (typeof window !== 'undefined') {
                    console.debug('[TokenManager] setTokens called');
                }
            } catch (err) {}
            
            if (typeof window !== 'undefined') {
                localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
                
                if (refreshToken) {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
                }
                
                try {
                    localStorage.setItem(this.TOKEN_SET_AT_KEY, String(Date.now()));
                } catch (e) {
                    
                }
            }

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
                
            }
        } catch (error) {
            
        }
    }

    static getAccessToken(): string | null {
        try {
            
            if (typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
                if (localToken) {
                    return localToken;
                }
            }

            const cookieToken = Cookies.get(this.ACCESS_TOKEN_KEY);
            if (cookieToken) {
                
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

    static getRefreshToken(): string | null {
        try {
            
            if (typeof window !== 'undefined') {
                const localToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
                if (localToken) {
                    return localToken;
                }
            }

            const cookieToken = Cookies.get(this.REFRESH_TOKEN_KEY);
            if (cookieToken) {
                
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

    static clearTokens() {
        try {
            
            try {
                if (typeof window !== 'undefined') {
                    
                    console.debug('[TokenManager] clearTokens called');

                    try {
                        
                        console.trace('[TokenManager] clearTokens stack trace');
                    } catch (e) {
                        
                    }
                }
            } catch (err) {}

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
                
            }
            
            Cookies.remove(this.ACCESS_TOKEN_KEY);
            Cookies.remove(this.REFRESH_TOKEN_KEY);

            if (typeof window !== 'undefined') {
                localStorage.removeItem(this.ACCESS_TOKEN_KEY);
                localStorage.removeItem(this.REFRESH_TOKEN_KEY);
                localStorage.removeItem('userData'); 
                try {
                    localStorage.removeItem(this.TOKEN_SET_AT_KEY);
                } catch (e) {
                    
                }
            }
        } catch (error) {
            
        }
    }

    static hasValidTokens(): boolean {
        const accessToken = this.getAccessToken();
        return !!accessToken;
    }
}


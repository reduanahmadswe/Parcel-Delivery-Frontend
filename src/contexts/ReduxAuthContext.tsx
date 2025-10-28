"use client";

import { AuthStateManager } from "../services/AuthStateManager";
import { TokenManager } from "../services/TokenManager";
import {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "../store/api/authApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loginSuccess,
  logout as logoutAction,
  selectAuthLoadingSafe,
  selectCurrentUserSafe,
  selectIsAuthenticatedSafe,
  setLoading,
  updateUser,
} from "../store/slices/authSlice";
import { User } from "../types/GlobalTypeDefinitions";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User }>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
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

const ReduxAuthContext = createContext<AuthContextType | undefined>(undefined);

export function ReduxAuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  // Get state from Redux store using type-safe selectors
  const userFromRedux = useAppSelector(selectCurrentUserSafe);
  const loading = useAppSelector(selectAuthLoadingSafe);
  const isAuthenticated = useAppSelector(selectIsAuthenticatedSafe);
  
  // ✅ CRITICAL FIX: Use local state with localStorage fallback
  // This ensures useAuth() hook always returns the most up-to-date user data
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from Redux or localStorage
    if (userFromRedux) return userFromRedux;
    try {
      const cached = localStorage.getItem('userData');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  
  // ✅ Update local state when Redux state changes
  useEffect(() => {
    if (userFromRedux) {
      console.log("📊 [ReduxAuthContext] Redux user changed:", userFromRedux.email, "role:", userFromRedux.role);
      setUser(userFromRedux);
    } else if (!userFromRedux && !TokenManager.getAccessToken()) {
      // No Redux user and no token means logged out
      console.log("🚪 [ReduxAuthContext] No user and no token, clearing local state");
      setUser(null);
    } else if (!userFromRedux && TokenManager.getAccessToken()) {
      // We have token but no Redux user - try localStorage fallback
      console.warn("⚠️ [ReduxAuthContext] Have token but no Redux user, checking localStorage");
      try {
        const cached = localStorage.getItem('userData');
        if (cached) {
          const cachedUser = JSON.parse(cached);
          console.log("🔄 [ReduxAuthContext] Restoring user from localStorage:", cachedUser.email);
          setUser(cachedUser);
          // Also update Redux to prevent this from happening again
          const token = TokenManager.getAccessToken();
          const refreshToken = TokenManager.getRefreshToken();
          if (token) {
            dispatch(loginSuccess({
              user: cachedUser,
              token,
              refreshToken: refreshToken || undefined,
            }));
          }
        }
      } catch (error) {
        console.error("❌ [ReduxAuthContext] Failed to restore from localStorage");
      }
    }
  }, [userFromRedux, dispatch]);

  // RTK Query mutations
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  // Get current user query for refresh
  // ✅ CRITICAL FIX: Skip query if we already have user data to prevent clearing state
  const {
    data: userData,
    error: userError,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !TokenManager.getAccessToken() || !!user, // Skip if no token OR if we already have user
  });

  // Initialize auth state on mount - only run once on app startup
  useEffect(() => {
    const initializeAuth = () => {
      console.log("🔧 [ReduxAuthContext] Initializing auth...");
      
      // Try to restore authentication from stored tokens and cached user
      const token = TokenManager.getAccessToken();
      const refreshToken = TokenManager.getRefreshToken();
      const cachedUserStr = localStorage.getItem("userData");

      if (token && cachedUserStr) {
        try {
          const cachedUser = JSON.parse(cachedUserStr);
          console.log("🔑 [ReduxAuthContext] Found stored auth, restoring user:", cachedUser.email, "role:", cachedUser.role);
          
          // Restore auth state immediately for better UX
          dispatch(
            loginSuccess({
              user: cachedUser,
              token,
              refreshToken: refreshToken || undefined,
            })
          );
          
          // Also set local state
          setUser(cachedUser);
          
          console.log("✅ [ReduxAuthContext] Auth restored from storage");
        } catch (error) {
          console.error("❌ [ReduxAuthContext] Failed to parse cached user, clearing auth");
          // If cached user is invalid, clear it
          localStorage.removeItem("userData");
          TokenManager.clearTokens();
          dispatch(logoutAction());
          setUser(null);
        }
      } else {
        console.log("ℹ️ [ReduxAuthContext] No stored auth found, ensuring clean state");
        // Only clear if we truly have nothing
        if (!token && !cachedUserStr) {
          dispatch(logoutAction());
          setUser(null);
        }
      }

      // Mark as initialized
      AuthStateManager.markAsInitialized();
    };

    // Only initialize once - prevent React Strict Mode double execution from causing issues
    if (!AuthStateManager.isInitialized()) {
      initializeAuth();
    } else {
      console.log("⏭️ [ReduxAuthContext] Already initialized, skipping");
    }
  }, [dispatch]); // Keep minimal dependencies

  // Handle user data from API
  useEffect(() => {
    if (userData?.data && TokenManager.getAccessToken()) {
      const apiUser = userData.data;
      const token = TokenManager.getAccessToken();
      const refreshToken = TokenManager.getRefreshToken();

      if (token) {
        dispatch(
          loginSuccess({
            user: apiUser,
            token,
            refreshToken: refreshToken || undefined,
          })
        );

        localStorage.setItem("userData", JSON.stringify(apiUser));
      }
    }
  }, [userData, dispatch]);

  // Handle authentication errors
  // ✅ CRITICAL FIX: Only clear auth on actual auth errors, not on query skip/cancel
  useEffect(() => {
    if (isUserError && userError) {
      // Only handle if we actually have a token (meaning user should be authenticated)
      const hasToken = TokenManager.getAccessToken();
      
      if (
        hasToken &&
        "status" in userError &&
        (userError.status === 401 || userError.status === 403)
      ) {
        console.warn("🚨 [ReduxAuthContext] Auth error detected, clearing session");
        dispatch(logoutAction());
        localStorage.removeItem("userData");

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
      }
    }
  }, [isUserError, userError, dispatch]);

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User }> => {
    try {
      dispatch(setLoading(true));

      const result = await loginMutation({ email, password }).unwrap();

      if (result && result.success && result.data) {
        const { user: userData, accessToken, refreshToken } = result.data;
        
        console.log("🔐 [ReduxAuthContext] Login successful, saving data for user:", userData.email, "role:", userData.role);
        
        // ✅ STEP 1: Save everything to storage FIRST
        TokenManager.setTokens(accessToken, refreshToken);
        localStorage.setItem("userData", JSON.stringify(userData));
        
        console.log("💾 [ReduxAuthContext] Saved to localStorage:", userData.role);

        // ✅ STEP 2: Dispatch to Redux with flushSync for immediate update
        try {
          flushSync(() => {
            dispatch(
              loginSuccess({
                user: userData,
                token: accessToken,
                refreshToken: refreshToken,
              })
            );
          });
          console.log("✅ [ReduxAuthContext] Redux state updated with flushSync");
        } catch (err) {
          dispatch(
            loginSuccess({
              user: userData,
              token: accessToken,
              refreshToken: refreshToken,
            })
          );
          console.log("✅ [ReduxAuthContext] Redux state updated (fallback)");
        }

        // ✅ STEP 3: Dispatch custom event to notify all components immediately
        if (typeof window !== 'undefined') {
          const loginEvent = new CustomEvent('userLoggedIn', { 
            detail: { user: userData, token: accessToken } 
          });
          window.dispatchEvent(loginEvent);
          console.log("📢 [ReduxAuthContext] Dispatched userLoggedIn event");
        }

        // ✅ STEP 4: Wait for Redux persist to complete
        await new Promise(resolve => setTimeout(resolve, 150));

        // Mark session as active to prevent auto-logout
        AuthStateManager.markSessionActive();

        toast.success("Login successful");
        console.log("🎉 [ReduxAuthContext] Login process complete");
        return { success: true, user: userData };
      }

      throw new Error("Login failed - invalid response structure");
    } catch (error: unknown) {
      dispatch(setLoading(false));
      
      let errorMessage = "Login failed";
      if (error && typeof error === "object") {
        if ("data" in error) {
          errorMessage = (error as { data?: { message?: string } }).data?.message || "Login failed";
        } else if ("message" in error) {
          errorMessage = (error as { message: string }).message;
        }
      }
      
      toast.error(errorMessage);
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
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message ||
            "Registration failed"
          : "Registration failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      logoutMutation().catch(() => {
        // Logout API error - ignore
      });
    } catch (error) {
      // Logout error - ignore
    } finally {
      console.log("🚪 [ReduxAuthContext] Logging out...");
      
      // Clear local state first
      setUser(null);
      
      // Clear tokens using TokenManager
      TokenManager.clearTokens();
      
      // Update Redux state
      dispatch(logoutAction());
      
      // Remove user data from localStorage
      localStorage.removeItem("userData");

      // Clear the active session
      AuthStateManager.clearSession();

      toast.success("Logged out successfully");
    }
  };

  // Refresh user function
  const refreshUser = async (): Promise<void> => {
    try {
      const result = await refetchUser();
      if (result.data?.data) {
        dispatch(updateUser(result.data.data));
        localStorage.setItem("userData", JSON.stringify(result.data.data));
      }
    } catch (error) {
      // Clear all authentication data
      TokenManager.clearTokens();
      dispatch(logoutAction());
      localStorage.removeItem("userData");
      
      // Redirect to login if in browser
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <ReduxAuthContext.Provider value={value}>
      {children}
    </ReduxAuthContext.Provider>
  );
}

export function useReduxAuth() {
  const context = useContext(ReduxAuthContext);
  if (context === undefined) {
    throw new Error("useReduxAuth must be used within a ReduxAuthProvider");
  }
  return context;
}


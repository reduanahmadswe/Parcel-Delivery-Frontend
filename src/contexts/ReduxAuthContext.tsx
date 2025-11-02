"use client";

import { AuthStateManager } from "../services/AuthStateManager";
import { clearReceiverLocalCache } from "../utils/realtimeSync";
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

  const userFromRedux = useAppSelector(selectCurrentUserSafe);
  const loading = useAppSelector(selectAuthLoadingSafe);
  const isAuthenticated = useAppSelector(selectIsAuthenticatedSafe);

  const [user, setUser] = useState<User | null>(() => {
    
    if (userFromRedux) return userFromRedux;
    try {
      const cached = localStorage.getItem('userData');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (userFromRedux) {
      setUser(userFromRedux);
    } else if (!userFromRedux && !TokenManager.getAccessToken()) {
      
      setUser(null);
    } else if (!userFromRedux && TokenManager.getAccessToken()) {
      
      console.warn("⚠️ [ReduxAuthContext] Have token but no Redux user, checking localStorage");
      try {
        const cached = localStorage.getItem('userData');
        if (cached) {
          const cachedUser = JSON.parse(cached);
          setUser(cachedUser);
          
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

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  const {
    data: userData,
    error: userError,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !TokenManager.getAccessToken() || !!user, 
  });

  useEffect(() => {
    const initializeAuth = () => {

      const token = TokenManager.getAccessToken();
      const refreshToken = TokenManager.getRefreshToken();
      const cachedUserStr = localStorage.getItem("userData");

      if (token && cachedUserStr) {
        try {
          const cachedUser = JSON.parse(cachedUserStr);

          dispatch(
            loginSuccess({
              user: cachedUser,
              token,
              refreshToken: refreshToken || undefined,
            })
          );

          setUser(cachedUser);
          
        } catch (error) {
          console.error("❌ [ReduxAuthContext] Failed to parse cached user, clearing auth");
          
          localStorage.removeItem("userData");
          TokenManager.clearTokens();
          dispatch(logoutAction());
          setUser(null);
        }
      } else {
        
        if (!token && !cachedUserStr) {
          dispatch(logoutAction());
          setUser(null);
        }
      }

      AuthStateManager.markAsInitialized();
    };

    if (!AuthStateManager.isInitialized()) {
      initializeAuth();
    } else {
    }
  }, [dispatch]); 

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

  useEffect(() => {
    if (isUserError && userError) {
      
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

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User }> => {
    try {
      dispatch(setLoading(true));

      const result = await loginMutation({ email, password }).unwrap();

      if (result && result.success && result.data) {
        const { user: userData, accessToken, refreshToken } = result.data;

        // Set tokens first
        TokenManager.setTokens(accessToken, refreshToken);
        localStorage.setItem("userData", JSON.stringify(userData));

        // Dispatch to Redux with flushSync for immediate state update
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
        } catch (err) {
          dispatch(
            loginSuccess({
              user: userData,
              token: accessToken,
              refreshToken: refreshToken,
            })
          );
        }

        // Update local state immediately
        setUser(userData);

        // Mark session as active
        AuthStateManager.markSessionActive();

        // Dispatch custom event
        if (typeof window !== 'undefined') {
          const loginEvent = new CustomEvent('userLoggedIn', { 
            detail: { user: userData, token: accessToken } 
          });
          window.dispatchEvent(loginEvent);
        }

        // Wait a bit for all state to propagate
        await new Promise(resolve => setTimeout(resolve, 250));

        // Set loading to false
        dispatch(setLoading(false));

        toast.success("Login successful");
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

  const logout = async (): Promise<void> => {
    try {
      logoutMutation().catch(() => {
        
      });
    } catch (error) {
      
    } finally {

      setUser(null);

      TokenManager.clearTokens();

      dispatch(logoutAction());

      localStorage.removeItem("userData");
      try {
        clearReceiverLocalCache();
      } catch (err) {
        // ignore
      }

      AuthStateManager.clearSession();

      toast.success("Logged out successfully");
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const result = await refetchUser();
      if (result.data?.data) {
        dispatch(updateUser(result.data.data));
        localStorage.setItem("userData", JSON.stringify(result.data.data));
      }
    } catch (error) {
      
      TokenManager.clearTokens();
      dispatch(logoutAction());
      localStorage.removeItem("userData");

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


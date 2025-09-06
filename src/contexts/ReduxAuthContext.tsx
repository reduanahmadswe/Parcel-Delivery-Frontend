"use client";

import { TokenManager } from "@/lib/TokenManager";
import {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginSuccess,
  logout as logoutAction,
  selectAuthLoadingSafe,
  selectCurrentUserSafe,
  selectIsAuthenticatedSafe,
  setLoading,
  updateUser,
} from "@/store/slices/authSlice";
import { User } from "@/types/GlobalTypeDefinitions";
import { createContext, ReactNode, useContext, useEffect } from "react";
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
  const user = useAppSelector(selectCurrentUserSafe);
  const loading = useAppSelector(selectAuthLoadingSafe);
  const isAuthenticated = useAppSelector(selectIsAuthenticatedSafe);

  // RTK Query mutations
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  // Get current user query for refresh
  const {
    data: userData,
    error: userError,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated && !TokenManager.getAccessToken(),
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = TokenManager.getAccessToken();
      const refreshToken = TokenManager.getRefreshToken();
      const cachedUserStr = localStorage.getItem("userData");

      if (token && cachedUserStr && !user) {
        try {
          const cachedUser = JSON.parse(cachedUserStr);
          dispatch(
            loginSuccess({
              user: cachedUser,
              token,
              refreshToken: refreshToken || undefined,
            })
          );
        } catch (error) {
          console.error("Failed to parse cached user data:", error);
          localStorage.removeItem("userData");
          TokenManager.clearTokens();
        }
      } else if (!token && user) {
        // No token but user exists in Redux, clear it
        dispatch(logoutAction());
      }
    };

    initializeAuth();
  }, [dispatch, user]);

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
  useEffect(() => {
    if (isUserError && userError) {
      console.error("User authentication error:", userError);

      if (
        "status" in userError &&
        (userError.status === 401 || userError.status === 403)
      ) {
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

      if (result.success && result.data) {
        const { user: userData, accessToken, refreshToken } = result.data;

        dispatch(
          loginSuccess({
            user: userData,
            token: accessToken,
            refreshToken,
          })
        );

        localStorage.setItem("userData", JSON.stringify(userData));

        toast.success("Login successful");
        return { success: true, user: userData };
      }

      throw new Error("Login failed");
    } catch (error: unknown) {
      dispatch(setLoading(false));
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message ||
            "Login failed"
          : "Login failed";
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
      logoutMutation().catch((error) => {
        console.error("Logout API error:", error);
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logoutAction());
      localStorage.removeItem("userData");
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
      console.error("Failed to refresh user:", error);
      dispatch(logoutAction());
      localStorage.removeItem("userData");
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

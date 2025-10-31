import { useCallback } from 'react';
import { User } from '../types/GlobalTypeDefinitions';

/**
 * Custom hook for handling navigation after authentication
 * Uses window.location for reliable navigation after login
 */
export const useAuthNavigation = () => {
  const navigateAfterLogin = useCallback((user: User) => {
    const dashboardPath = 
      user.role === "admin" ? "/admin/dashboard" :
      user.role === "sender" ? "/sender/dashboard" :
      user.role === "receiver" ? "/receiver/dashboard" :
      "/";

    // Use window.location for more reliable navigation after login
    // This ensures a full page load with fresh state
    setTimeout(() => {
      window.location.href = dashboardPath;
    }, 300);
  }, []);

  const navigateToDashboard = useCallback((role: User['role']) => {
    const dashboardPath = 
      role === "admin" ? "/admin/dashboard" :
      role === "sender" ? "/sender/dashboard" :
      role === "receiver" ? "/receiver/dashboard" :
      "/";

    window.location.href = dashboardPath;
  }, []);

  return {
    navigateAfterLogin,
    navigateToDashboard,
  };
};

export default useAuthNavigation;

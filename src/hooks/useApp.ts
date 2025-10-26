import { useEffect, useState } from "react";

/**
 * Custom hook for app initialization
 * এখানে app-level setup logic থাকবে
 */
export const useAppInitialization = () => {
  useEffect(() => {
    // App initialization logic
    console.log("🚀 App initialized successfully!");
    
    // Example: Load user preferences, check auth status, etc.
    // setTimeout(() => {
    //   console.log("App setup completed");
    // }, 1000);
  }, []);
};

/**
 * Custom hook for global app state
 * App এর global state manage করার জন্য
 */
export const useAppState = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initialization delay
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setIsLoading(false);
    }, 100); // Very quick initialization

    return () => clearTimeout(timer);
  }, []);

  return {
    isInitialized,
    isLoading,
  };
};

/**
 * Custom hook for app performance monitoring
 * Performance tracking এর জন্য
 */
export const useAppPerformance = () => {
  useEffect(() => {
    // Performance monitoring logic
    const measurePerformance = () => {
      if (typeof window !== "undefined" && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - 
                        window.performance.timing.navigationStart;
        console.log(`⚡ App load time: ${loadTime}ms`);
      }
    };

    // Measure performance when component mounts
    measurePerformance();
  }, []);
};

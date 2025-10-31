import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "../components/ui/theme-provider";
import { ReduxAuthProvider } from "../contexts/ReduxAuthContext";
import { persistor, store } from "../store";

const appConfig = {
  toast: {
    position: "top-right" as const,
    toastOptions: {
      duration: 4000,
      style: { background: "#363636", color: "#fff" },
      success: { duration: 3000, style: { background: "#10b981" } },
      error: { duration: 5000, style: { background: "#ef4444" } },
    },
  },
};

const AppLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white" />
  </div>
);

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <Provider store={store}>
      <PersistGate loading={<AppLoader />} persistor={persistor}>
        <ReduxAuthProvider>
          <Router>
            {children}
            <Toaster {...appConfig.toast} />
          </Router>
        </ReduxAuthProvider>
      </PersistGate>
    </Provider>
  </ThemeProvider>
);

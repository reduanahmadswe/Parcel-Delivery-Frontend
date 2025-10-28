import React, { useEffect } from "react";
import { AppProviders } from "./providers";
import { AppRouter } from "./components/AppRouter";

const App: React.FC = () => {
  useEffect(() => {
    console.log("✨ [App.tsx] App component mounted");
    console.log("📍 [App.tsx] Current route:", window.location.pathname);
  }, []);

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;

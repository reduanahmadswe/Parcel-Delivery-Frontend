import React, { useEffect } from "react";
import { AppProviders } from "./providers";
import { AppRouter } from "./components/AppRouter";

const App: React.FC = () => {
  useEffect(() => {
  }, []);

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;

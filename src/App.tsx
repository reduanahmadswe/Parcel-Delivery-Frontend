import React from "react";
import { AppProviders } from "./providers";
import { AppRouter } from "./components/AppRouter";

const App: React.FC = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);

export default App;

import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/globals.css";
import App from "./App";

// 🔍 Debug log for page load
console.log("🚀 [main.tsx] Application starting...");
console.log("📍 [main.tsx] Current URL:", window.location.href);
console.log("🛣️ [main.tsx] Pathname:", window.location.pathname);
console.log("🔗 [main.tsx] Hash:", window.location.hash);
console.log("❓ [main.tsx] Search:", window.location.search);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


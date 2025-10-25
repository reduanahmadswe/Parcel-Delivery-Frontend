import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/globals.css";

// Environment configuration check
console.log('='.repeat(60));
console.log('🔍 ENVIRONMENT CONFIGURATION');
console.log('='.repeat(60));
console.log('📍 VITE_API_URL:', (import.meta as any).env?.VITE_API_URL);
console.log('📍 MODE:', (import.meta as any).env?.MODE);
console.log('📍 DEV:', (import.meta as any).env?.DEV);
console.log('='.repeat(60));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


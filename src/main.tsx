import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/globals.css";
import App from "./App";
import { getCacheStats, checkCacheHealth, clearAllCache, setStoreDispatch } from "./utils/adminCache";
import { store } from "./store/store";
import debugPersist from "./utils/debugPersist";

// Register store dispatch for cache invalidation
setStoreDispatch(store.dispatch);

// Handle redirect from 404.html (for SPA routing on Render)
const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');
if (redirect) {
  // Remove the redirect parameter and navigate to the intended path
  window.history.replaceState(null, '', redirect);
}

// Load cache stats on app load
const cacheStats = getCacheStats();

// Make cache utilities available in console for debugging
(window as any).__getCacheStats = getCacheStats;
(window as any).__checkCacheHealth = checkCacheHealth;
(window as any).__clearCache = clearAllCache;
(window as any).__debugPersist = debugPersist;

// Auto-run debug on load in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    debugPersist();
  }, 1000);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


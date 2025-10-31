import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/globals.css";
import App from "./App";
import { getCacheStats, checkCacheHealth, clearAllCache, setStoreDispatch } from "./utils/adminCache";
import { store } from "./store/store";
import debugPersist from "./utils/debugPersist";

setStoreDispatch(store.dispatch);

const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');
if (redirect) {
  
  window.history.replaceState(null, '', redirect);
}

const cacheStats = getCacheStats();

(window as any).__getCacheStats = getCacheStats;
(window as any).__checkCacheHealth = checkCacheHealth;
(window as any).__clearCache = clearAllCache;
(window as any).__debugPersist = debugPersist;

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


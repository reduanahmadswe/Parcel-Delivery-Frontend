# 🔍 DEBUG করার নির্দেশাবলী

## প্রথম লগইন করার সময় যা করতে হবে:

### ১. Browser Console খুলুন (F12)

### ২. Console এ নিচের লগগুলো দেখুন:

প্রথম লগইন করলে আপনার এরকম logs দেখতে হবে:

```
🚀 [LoginForm] Starting login process...
🔐 [ReduxAuthContext] Login successful, saving data for user: xxx@xxx.com role: admin/sender/receiver
💾 [ReduxAuthContext] Saved to localStorage: admin/sender/receiver
✅ [ReduxAuthContext] Redux state updated with flushSync
📢 [ReduxAuthContext] Dispatched userLoggedIn event
🎉 [ReduxAuthContext] Login process complete
🔍 [LoginForm] Login result: {success: true, user: {...}}
✅ [LoginForm] Login successful for user: xxx@xxx.com role: admin/sender/receiver
⏳ [LoginForm] Waiting for state propagation...
🧭 [LoginForm] Navigating to: /admin/dashboard (or /sender/dashboard or /receiver/dashboard)
📢 [Navigation] Received userLoggedIn event, role: admin/sender/receiver
📊 [Navigation] Redux user updated: xxx@xxx.com role: admin/sender/receiver
```

### ৩. যদি Navigation logs না আসে:

Console এ manually check করুন:

```javascript
// localStorage check করুন
JSON.parse(localStorage.getItem('userData'))

// Redux store check করুন
window.__REDUX_DEVTOOLS_EXTENSION__ ? "Redux DevTools installed" : "No Redux DevTools"
```

### ৪. Problem যদি থাকে:

**যদি দেখেন যে:**
- localStorage এ user আছে কিন্তু Navigation component user পাচ্ছে না
- Redux state update হচ্ছে না
- userLoggedIn event dispatch হচ্ছে না

**তাহলে console এ পুরো log টা copy করে আমাকে পাঠান**

### ৫. Additional Debug:

Console এ run করুন:

```javascript
// Current user in Redux
console.log("Redux user:", window.__REDUX_STATE__?.auth?.user)

// Current user in localStorage
console.log("LocalStorage user:", JSON.parse(localStorage.getItem('userData')))

// Tokens
console.log("Access token:", localStorage.getItem('accessToken'))
```

## সমস্যা হলে কী করবেন:

1. **Logout করুন**
2. **localStorage clear করুন:** Console এ `localStorage.clear()` run করুন
3. **Page refresh করুন**
4. **আবার login করুন**
5. **Console logs copy করুন এবং আমাকে পাঠান**

---

## Quick Test:

আপনি এখনই test করতে পারেন:

1. Logout করুন
2. Console clear করুন (Console এ right click > Clear console)
3. Login করুন
4. Console logs দেখুন
5. Navbar এ আপনার নাম এবং role-based menu দেখা যাচ্ছে কিনা check করুন

যদি এখনো সমস্যা থাকে, তাহলে console এর screenshot বা logs পাঠান!

# 🔍 Complete Token Flow Debugging Guide

## ✅ What I Added - Comprehensive Logging

I've added detailed logging to **every step** of the token flow so you can see exactly where the problem is.

---

## 📊 Login Flow - What You Should See in Console

### **Step 1: Login Mutation**
```
🔐 authSlice.loginSuccess called with: {
  hasUser: true,
  userEmail: "admin@parceldelivery.com",
  hasToken: true,
  tokenPreview: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  hasRefreshToken: true,
  refreshTokenPreview: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
💾 Calling TokenManager.setTokens...
```

### **Step 2: TokenManager Storage**
```
💾 TokenManager.setTokens called with: {
  hasAccessToken: true,
  accessTokenPreview: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  hasRefreshToken: true,
  refreshTokenPreview: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
✅ Access token stored in localStorage
✅ Refresh token stored in localStorage
🔍 Verification - Tokens in localStorage: {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
✅ Tokens also stored in cookies
```

### **Step 3: Completion**
```
✅ User data saved to localStorage
✅ loginSuccess completed - Redux state updated
```

---

## 🔎 API Request Flow - What You Should See

### **When Making an Authenticated Request**:

```
✅ Access token retrieved from localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6...
✅ Token added to request: eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### **If Token Refresh Happens (401 Error)**:

```
🔄 401 Unauthorized - Attempting token refresh...
✅ Refresh token retrieved from localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6...
✅ Token refresh successful
🔄 authSlice.refreshTokenSuccess called
New access token: eyJhbGciOiJIUzI1NiIsInR5cCI6...
💾 TokenManager.setTokens called with: {...}
✅ Access token stored in localStorage
✅ Refresh token stored in localStorage
✅ refreshTokenSuccess completed
```

---

## 🐛 Debugging Steps

### **1. Clear Everything First**
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### **2. Login and Watch Console**

After clicking login, you should see this **exact sequence**:

1. ✅ `authSlice.loginSuccess called with:` - Shows tokens received
2. ✅ `TokenManager.setTokens called with:` - Shows tokens being stored
3. ✅ `Access token stored in localStorage`
4. ✅ `Refresh token stored in localStorage`
5. ✅ `Verification - Tokens in localStorage:` - Confirms storage worked

### **3. Check localStorage Manually**

```javascript
// In console after login
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
console.log('User Data:', localStorage.getItem('userData'));
```

**Expected**: All three should have values.

---

## ❌ Common Issues & Solutions

### **Issue 1: "⚠️ No access token found in localStorage"**

**Seen When**: Making API requests after login

**Possible Causes**:
1. Login didn't complete successfully
2. Tokens weren't in the login response
3. `loginSuccess` wasn't dispatched

**Debug**:
```javascript
// Check if loginSuccess was called
// Look for: "🔐 authSlice.loginSuccess called with:"
// If missing, the issue is in ReduxAuthContext.tsx
```

---

### **Issue 2: "hasToken: false" in loginSuccess**

**Seen When**: During login

**Possible Causes**:
1. Backend didn't return tokens
2. Wrong response structure extraction

**Debug**:
Check `ReduxAuthContext.tsx` login function:
```typescript
const { user: userData, accessToken, refreshToken } = result.data;
```

Make sure `result.data` actually has these fields!

---

### **Issue 3: Tokens stored but immediately lost**

**Seen When**: Tokens show as stored but next request shows "No token"

**Possible Causes**:
1. Page refresh clearing Redux state
2. Redux persist not configured
3. Multiple tabs conflicting

**Solution**: Check if you have redux-persist configured for auth state.

---

### **Issue 4: "❌ No refresh token available"**

**Seen When**: Token refresh attempt

**Possible Causes**:
1. Refresh token wasn't stored during login
2. Refresh token was cleared
3. `refreshToken` was `undefined` in login response

**Debug**:
```javascript
// After login, check:
console.log('Refresh Token:', localStorage.getItem('refreshToken'));

// Should NOT be null
```

---

## 🧪 Testing Checklist

### **Test 1: Fresh Login**

1. Clear localStorage
2. Login
3. **Check console for**:
   - ✅ `authSlice.loginSuccess called`
   - ✅ `TokenManager.setTokens called`
   - ✅ `Tokens stored in localStorage`

4. **Verify localStorage**:
   ```javascript
   localStorage.getItem('accessToken') // Should have token
   localStorage.getItem('refreshToken') // Should have token
   ```

---

### **Test 2: Authenticated Request**

1. After login, make an API call (e.g., get profile)
2. **Check console for**:
   - ✅ `Access token retrieved from localStorage`
   - ✅ `Token added to request`

3. **Check Network tab**:
   - Request should have `Authorization: Bearer <token>` header
   - Should return 200 OK

---

### **Test 3: Token Refresh**

1. Delete access token from localStorage (keep refresh token):
   ```javascript
   localStorage.removeItem('accessToken');
   ```

2. Make an API request
3. **Check console for**:
   - ✅ `401 Unauthorized - Attempting token refresh`
   - ✅ `Refresh token retrieved from localStorage`
   - ✅ `Token refresh successful`
   - ✅ `refreshTokenSuccess called`

4. **Verify new tokens**:
   ```javascript
   localStorage.getItem('accessToken') // Should have NEW token
   ```

---

### **Test 4: Complete Logout**

1. Delete both tokens:
   ```javascript
   localStorage.removeItem('accessToken');
   localStorage.removeItem('refreshToken');
   ```

2. Make an API request
3. **Expected**:
   - ⚠️ `No token available for request`
   - ❌ `No refresh token available - logging out`
   - Redirect to `/login`

---

## 🎯 What the Logs Tell You

### **If you see**:
```
💾 TokenManager.setTokens called with: {
  hasAccessToken: false,  ← ❌ PROBLEM!
  ...
}
```
**Issue**: `loginSuccess` was called with an empty token.  
**Fix**: Check login response parsing in `ReduxAuthContext.tsx`

---

### **If you see**:
```
✅ Access token stored in localStorage
⚠️ No access token found in localStorage  ← ❌ PROBLEM!
```
**Issue**: Token stored but immediately lost.  
**Fix**: Check for code that clears localStorage after login.

---

### **If you see**:
```
⚠️ No refresh token provided to setTokens  ← ⚠️ WARNING
```
**Issue**: Login response didn't include refresh token.  
**Fix**: Check backend is returning `refreshToken` in login response.

---

### **If you DON'T see**:
```
🔐 authSlice.loginSuccess called with:
```
**Issue**: `loginSuccess` action was never dispatched.  
**Fix**: Check `ReduxAuthContext.tsx` - ensure `dispatch(loginSuccess(...))` is called.

---

## 📝 Quick Reference

### **Expected Console Output (Successful Login)**:
```
1. 🔐 authSlice.loginSuccess called with: {...}
2. 💾 Calling TokenManager.setTokens...
3. 💾 TokenManager.setTokens called with: {...}
4. ✅ Access token stored in localStorage
5. ✅ Refresh token stored in localStorage
6. 🔍 Verification - Tokens in localStorage: {...}
7. ✅ User data saved to localStorage
8. ✅ loginSuccess completed
```

### **Expected Console Output (API Request)**:
```
1. ✅ Access token retrieved from localStorage: eyJh...
2. ✅ Token added to request: eyJh...
```

### **Expected Console Output (Token Refresh)**:
```
1. 🔄 401 Unauthorized - Attempting token refresh...
2. ✅ Refresh token retrieved from localStorage: eyJh...
3. ✅ Token refresh successful
4. 🔄 authSlice.refreshTokenSuccess called
5. 💾 TokenManager.setTokens called with: {...}
6. ✅ Access token stored in localStorage
```

---

## 🎉 Success Indicators

✅ See all login logs in sequence  
✅ localStorage has `accessToken` and `refreshToken`  
✅ API requests include Authorization header  
✅ No "⚠️ No token available" warnings  
✅ Token refresh works on 401  

---

**Now login and check the console!**  
The logs will tell you exactly where the problem is.

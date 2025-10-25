# 🚀 Render Deployment Guide

## 📋 Deployment URLs

- **Frontend**: https://parcel-delivery-frontend.onrender.com
- **Backend**: https://parcel-delivery-api.onrender.com

---

## ✅ Frontend Configuration (Complete)

### 1. Environment Variables
Already configured in `render.yaml`:
```yaml
envVars:
  - key: VITE_API_URL
    value: https://parcel-delivery-api.onrender.com/api
```

### 2. Build Configuration
```yaml
buildCommand: npm run build
staticPublishPath: ./dist
```

### 3. SPA Routing
Configured in `public/_redirects`:
```
/*    /index.html   200
```

---

## 🔧 Backend Configuration Required

**CRITICAL**: Your backend MUST allow requests from your frontend URL!

### Update Backend CORS Configuration:

#### Option 1: Update `src/app.ts` (or wherever CORS is configured)

```typescript
import cors from 'cors';
import express from 'express';

const app = express();

// ✅ CORS Configuration - Add your frontend URL
app.use(cors({
  origin: [
    'http://localhost:3000',                              // Development
    'https://parcel-delivery-frontend.onrender.com'      // Production ✅
  ],
  credentials: false,  // We use Bearer tokens, not cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 24 hours
}));

// Your other middleware...
app.use(express.json());
```

#### Option 2: Use Environment Variable (Better approach)

**Backend `.env` or Render environment variables**:
```env
# Development
FRONTEND_URL=http://localhost:3000

# Production (Update in Render Dashboard)
FRONTEND_URL=https://parcel-delivery-frontend.onrender.com
```

**Backend code**:
```typescript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',  // Keep for local dev
  ],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 📝 Deployment Steps

### Frontend (Already Done ✅)

1. ✅ **Environment configured** in `render.yaml`
2. ✅ **Build command** set to `npm run build`
3. ✅ **Static publish path** set to `./dist`
4. ✅ **SPA routing** configured in `_redirects`

### Backend (Action Required ⚠️)

1. **Add frontend URL to CORS**
   - Go to your backend code
   - Find CORS configuration (usually in `src/app.ts`)
   - Add: `https://parcel-delivery-frontend.onrender.com`

2. **Update Environment Variables in Render**
   - Go to: https://dashboard.render.com
   - Select your backend service
   - Go to "Environment" tab
   - Add/Update:
     ```
     FRONTEND_URL=https://parcel-delivery-frontend.onrender.com
     ```

3. **Deploy Backend**
   - After updating CORS, redeploy backend
   - Render will auto-deploy if connected to Git

---

## 🧪 Testing Production

### 1. Test Backend CORS

```bash
# Test if backend allows frontend origin
curl -i -X OPTIONS https://parcel-delivery-api.onrender.com/api/auth/login \
  -H "Origin: https://parcel-delivery-frontend.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"
```

**Expected Response**:
```
HTTP/2 204
access-control-allow-origin: https://parcel-delivery-frontend.onrender.com
access-control-allow-methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
access-control-allow-headers: Content-Type, Authorization
```

### 2. Test Frontend Login

1. Go to: https://parcel-delivery-frontend.onrender.com/login
2. Login with:
   - Email: `admin@parceldelivery.com`
   - Password: `Admin123!`
3. Open DevTools (F12) → Network tab
4. Check login request:
   - Should go to: `https://parcel-delivery-api.onrender.com/api/auth/login`
   - Status: `200 OK`
   - Response has `accessToken`

---

## 🐛 Common Production Issues

### Issue 1: CORS Error in Production

**Error**:
```
Access to fetch at 'https://parcel-delivery-api.onrender.com/api/auth/login' 
from origin 'https://parcel-delivery-frontend.onrender.com' has been blocked by CORS policy
```

**Solution**:
- Backend CORS is not configured
- Add frontend URL to backend CORS allowed origins
- Redeploy backend

### Issue 2: 404 on Page Refresh

**Error**: Refreshing `/dashboard` shows 404

**Solution**: Already fixed with `_redirects` file ✅

### Issue 3: Environment Variables Not Working

**Error**: Frontend still points to localhost

**Solution**:
- Check Render dashboard → Environment tab
- Ensure `VITE_API_URL` is set
- Rebuild frontend (Render auto-rebuilds on push)

---

## 📊 Deployment Checklist

### Frontend ✅
- [x] `render.yaml` configured
- [x] `VITE_API_URL` set in render.yaml
- [x] `.env.production` has correct API URL
- [x] `_redirects` file for SPA routing
- [x] Build command: `npm run build`
- [x] Publish directory: `./dist`

### Backend ⚠️
- [ ] Add `https://parcel-delivery-frontend.onrender.com` to CORS
- [ ] Set `credentials: false` in CORS config
- [ ] Update `FRONTEND_URL` environment variable
- [ ] Redeploy backend
- [ ] Test CORS with curl

---

## 🔄 How to Deploy Updates

### Frontend
```bash
# 1. Make changes
# 2. Commit to Git
git add .
git commit -m "Update frontend"
git push origin master

# Render will auto-deploy
```

### Backend
```bash
# 1. Update CORS configuration
# 2. Commit to Git
git add .
git commit -m "Add frontend URL to CORS"
git push origin master

# Render will auto-deploy
```

---

## 📞 Backend Team Instructions

Send this to your backend team:

---

**Subject**: Add Production Frontend URL to CORS

Hi,

Please add our production frontend URL to the CORS configuration:

**Frontend URL**: `https://parcel-delivery-frontend.onrender.com`

**Required Changes**:

1. Update CORS configuration in `src/app.ts` (or wherever CORS is set):

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://parcel-delivery-frontend.onrender.com'  // Add this
  ],
  credentials: false,  // Important: false for Bearer tokens
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

2. Update `FRONTEND_URL` environment variable in Render:
   - Go to Render Dashboard → Backend Service → Environment
   - Update: `FRONTEND_URL=https://parcel-delivery-frontend.onrender.com`

3. Redeploy backend

**Testing**:
After deployment, test with:
```bash
curl -i -X OPTIONS https://parcel-delivery-api.onrender.com/api/auth/login \
  -H "Origin: https://parcel-delivery-frontend.onrender.com" \
  -H "Access-Control-Request-Method: POST"
```

Should return:
```
access-control-allow-origin: https://parcel-delivery-frontend.onrender.com
```

Thanks!

---

## 🎯 Environment Summary

### Development (Local)
```
Frontend: http://localhost:3000
API: /api (proxied to https://parcel-delivery-api.onrender.com)
VITE_API_URL: /api
```

### Production (Render)
```
Frontend: https://parcel-delivery-frontend.onrender.com
API: https://parcel-delivery-api.onrender.com/api
VITE_API_URL: https://parcel-delivery-api.onrender.com/api
```

---

## ✅ Next Steps

1. **Push frontend code to Git**:
   ```bash
   git add .
   git commit -m "Configure production deployment"
   git push origin master
   ```

2. **Update backend CORS** (or ask backend team)

3. **Test production** at https://parcel-delivery-frontend.onrender.com

4. **Verify login works** in production

---

**Status**: Frontend ready to deploy ✅  
**Action Required**: Update backend CORS ⚠️

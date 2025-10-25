# Backend CORS Configuration Guide

## 🎯 Current Status

### ✅ Development (Localhost)
**No backend changes needed!** The Vite proxy handles everything.

### ⚠️ Production Deployment
Backend needs CORS configuration to allow your deployed frontend.

---

## 🔧 Backend Configuration Needed (Production Only)

### Option 1: Using `cors` package (Recommended)

**Install cors package** (if not already installed):
```bash
npm install cors
npm install --save-dev @types/cors
```

**Update your Express app** (usually in `src/app.ts` or `src/server.ts`):

```typescript
import cors from 'cors';
import express from 'express';

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',                        // Development
    'https://your-frontend.netlify.app',           // Production frontend
    'https://your-frontend.vercel.app',            // Alternative production
  ],
  credentials: false,  // ⚠️ IMPORTANT: Set to false (we use Bearer tokens, not cookies)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 24 hours
}));

// Your other middleware...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes...
```

### Option 2: Manual CORS Headers

```typescript
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-frontend.netlify.app',
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});
```

---

## 📋 Backend README Extract

Based on your backend README, I see:

```typescript
// Current backend configuration (from your README)
FRONTEND_URL=http://localhost:3000
```

**You need to update this for production:**

### Development (.env.development or .env.local)
```env
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Production (.env.production or production environment variables)
```env
FRONTEND_URL=https://your-deployed-frontend.com
NODE_ENV=production
```

---

## 🔍 How to Find Your Backend CORS Config

Look for these files in your backend:

1. **Check `src/app.ts`** or **`src/server.ts`**:
   ```typescript
   // Look for:
   app.use(cors(...))
   // or
   app.use((req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', ...)
   })
   ```

2. **Check for CORS middleware** in `src/middlewares/`:
   - `cors.ts`
   - `corsHandler.ts`
   - Similar files

3. **Check environment files**:
   - `.env`
   - `.env.example`
   - Look for `FRONTEND_URL` or `CORS_ORIGIN`

---

## ✅ Testing Backend CORS

### Test with curl:

```bash
# Test preflight request
curl -i -X OPTIONS https://parcel-delivery-api.onrender.com/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"
```

**Expected response:**
```
HTTP/2 204 
access-control-allow-origin: http://localhost:3000
access-control-allow-methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
access-control-allow-headers: Content-Type, Authorization
```

### Test with browser (after deployment):

**From deployed frontend, check Network tab:**
```
Request URL: https://parcel-delivery-api.onrender.com/api/auth/login
Status: 200 OK

Response Headers:
  access-control-allow-origin: https://your-frontend.com
  access-control-allow-methods: GET, POST, ...
```

---

## 🚨 Common Backend CORS Mistakes

### ❌ WRONG: Using `*` with credentials
```typescript
app.use(cors({
  origin: '*',           // ❌ Can't use * with credentials
  credentials: true,     // ❌ Conflict!
}));
```

### ❌ WRONG: credentials: true when using Bearer tokens
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  // ❌ Not needed for Bearer tokens!
}));
```

### ✅ CORRECT: For Bearer token authentication
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend.com'],
  credentials: false,  // ✅ We use Authorization header, not cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 📝 Backend Team Checklist

When deploying to production:

- [ ] Install `cors` package
- [ ] Add CORS middleware to Express app
- [ ] Add production frontend URL to allowed origins
- [ ] Set `credentials: false` (we use Bearer tokens)
- [ ] Include `Authorization` in `allowedHeaders`
- [ ] Test with curl before deploying
- [ ] Update environment variables
- [ ] Deploy backend
- [ ] Test with deployed frontend

---

## 🎯 Current Setup Summary

### Development (✅ Working):
```
Frontend (localhost:3000)
  → Vite Proxy
  → Backend (parcel-delivery-api.onrender.com)
  → ✅ No CORS needed (proxy handles it)
```

### Production (⚠️ Needs Backend Update):
```
Frontend (your-frontend.netlify.app)
  → Direct to Backend (parcel-delivery-api.onrender.com)
  → ⚠️ Backend must allow this origin in CORS
```

---

## 📞 Questions for Backend Team

Ask your backend team:

1. **Where is CORS configured?** (app.ts? middleware?)
2. **What's in the `FRONTEND_URL` environment variable?**
3. **Is `cors` package installed?**
4. **Can you add our deployed frontend URL to allowed origins?**
5. **Is `credentials` set to `false`?**

---

## 🎉 Summary

### For Development (Now):
✅ **No backend changes needed** - Vite proxy handles everything!

### For Production (Later):
⚠️ **Backend needs**:
- Add your deployed frontend URL to CORS allowed origins
- Ensure `credentials: false`
- Ensure `Authorization` header is allowed

---

**Next Step**: Test development setup first, then worry about production CORS later.

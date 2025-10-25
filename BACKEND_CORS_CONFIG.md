# Backend CORS Configuration for Production

## 🚨 URGENT: Backend Configuration Required

Your frontend is deployed at: **https://parcel-delivery-frontend.onrender.com**

The backend MUST allow requests from this URL to avoid CORS errors.

---

## ✅ Required Backend Changes

### 1. Update CORS Configuration

**File**: `src/app.ts` (or wherever Express app is configured)

```typescript
import cors from 'cors';
import express from 'express';

const app = express();

// ✅ CORS Configuration - MUST include production frontend URL
app.use(cors({
  origin: [
    'http://localhost:3000',                              // Development
    'https://parcel-delivery-frontend.onrender.com'      // Production ✅ ADD THIS
  ],
  credentials: false,  // ⚠️ IMPORTANT: false because we use Bearer tokens
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 24 hours
}));

// Rest of your middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes...
```

---

### 2. Better Approach: Use Environment Variable

**Backend `.env` or Render Environment Variables**:

```env
# Add to Render Dashboard → Backend Service → Environment
FRONTEND_URL=https://parcel-delivery-frontend.onrender.com
```

**Backend Code**:

```typescript
import cors from 'cors';
import express from 'express';

const app = express();

// ✅ CORS with environment variable (recommended)
const allowedOrigins = [
  'http://localhost:3000',  // Development
  process.env.FRONTEND_URL, // Production from environment
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: false,  // We use Authorization header, not cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400,
}));
```

---

### 3. Alternative: Dynamic CORS (Most Flexible)

```typescript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://parcel-delivery-frontend.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 🔧 Render Environment Variables

### Set in Render Dashboard:

1. Go to: https://dashboard.render.com
2. Select your backend service: `parcel-delivery-api`
3. Click "Environment" tab
4. Add/Update:

```
FRONTEND_URL=https://parcel-delivery-frontend.onrender.com
```

5. Click "Save Changes"
6. Backend will auto-deploy

---

## 🧪 Testing CORS Configuration

### Test with curl:

```bash
curl -i -X OPTIONS https://parcel-delivery-api.onrender.com/api/auth/login \
  -H "Origin: https://parcel-delivery-frontend.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"
```

### Expected Response:

```http
HTTP/2 204 No Content
access-control-allow-origin: https://parcel-delivery-frontend.onrender.com
access-control-allow-methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
access-control-allow-headers: Content-Type, Authorization
access-control-max-age: 86400
```

### ❌ If you see this (WRONG):

```http
HTTP/2 200 OK
(no access-control headers)
```

**Solution**: CORS is not configured. Add the configuration above.

---

## 🐛 Common Mistakes

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
  origin: 'https://parcel-delivery-frontend.onrender.com',
  credentials: true,  // ❌ Not needed! We use Authorization header
}));
```

### ✅ CORRECT: For Bearer token authentication

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://parcel-delivery-frontend.onrender.com'
  ],
  credentials: false,  // ✅ We use Authorization header, not cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 📋 Deployment Checklist

### Before Deploying Backend:

- [ ] Add production frontend URL to CORS origins
- [ ] Set `credentials: false`
- [ ] Include `Authorization` in `allowedHeaders`
- [ ] Set `FRONTEND_URL` environment variable in Render
- [ ] Test locally first (if possible)

### After Deploying Backend:

- [ ] Test CORS with curl (see above)
- [ ] Test login from production frontend
- [ ] Check browser console for CORS errors
- [ ] Verify Network tab shows successful requests

---

## 🚀 Quick Deploy Commands

### 1. Update Code:

```bash
# In your backend repository
git add .
git commit -m "Add production frontend to CORS"
git push origin master
```

### 2. Render Auto-Deploys:

Render will automatically detect the push and deploy.

### 3. Monitor Deployment:

- Go to: https://dashboard.render.com
- Select backend service
- Click "Events" tab
- Watch deployment progress

---

## 🔍 Where to Find CORS Configuration

Check these files in your backend:

1. **Main app file**:
   - `src/app.ts`
   - `src/server.ts`
   - `app.ts`
   - `server.ts`

2. **Middleware folder**:
   - `src/middlewares/cors.ts`
   - `src/config/cors.ts`

3. **Look for**:
   ```typescript
   import cors from 'cors';
   app.use(cors(...))
   ```

---

## 📞 Need Help?

If you're not sure where to add this:

1. Find where `app.use(cors(...))` is called
2. Update the `origin` array to include production frontend URL
3. Ensure `credentials: false`
4. Push and deploy

---

## ✅ Success Indicators

After updating backend CORS:

1. **curl test** returns `access-control-allow-origin` header ✅
2. **Frontend login** works without CORS errors ✅
3. **Network tab** shows successful API requests ✅
4. **No CORS errors** in browser console ✅

---

**Status**: ⚠️ Backend CORS update required  
**Frontend**: ✅ Ready to deploy  
**Next**: Update backend CORS and deploy

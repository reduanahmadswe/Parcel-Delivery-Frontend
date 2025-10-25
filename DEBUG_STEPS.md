# 🔍 Debug Steps - Login Logout সমস্যা

## সমস্যা:
Login করার পর সাথে সাথে logout হয়ে যাচ্ছে

## কারণ সমূহ:

### 1. ❌ Token Backend Response এ ভুল structure
Backend থেকে token এভাবে আসা উচিত:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "123",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### 2. ❌ Cookie SameSite সমস্যা
Frontend এবং Backend আলাদা domain এ থাকলে `sameSite: 'none'` লাগবে

### 3. ❌ CORS Configuration সমস্যা
Backend এ CORS properly configure করা নেই

---

## ✅ Frontend এ যা করা হয়েছে:

### 1. AuthContext.tsx
- ✅ Token clear করা বন্ধ করা হয়েছে
- ✅ Authentication restore করা হয়েছে
- ✅ Debug logging add করা হয়েছে

### 2. TokenManager.ts
- ✅ Cookie settings fix: `sameSite: 'none', secure: true`
- ✅ LocalStorage fallback রাখা হয়েছে

### 3. apiSlice.ts
- ✅ Debug logging add করা হয়েছে
- ✅ Token header check করা হয়েছে

---

## 🚨 Backend এ যা করতে হবে:

### 1. CORS Configuration (Express.js)
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://parcel-delivery-frontend.onrender.com',
  credentials: true, // ✅ এটা খুবই important
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));
```

### 2. Cookie Configuration
```javascript
// Login route এ
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true, // ✅ HTTPS এর জন্য
  sameSite: 'none', // ✅ Cross-domain এর জন্য
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

### 3. Response Structure
```javascript
// Login route
router.post('/auth/login', async (req, res) => {
  // ... authentication logic
  
  res.json({
    success: true,
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  });
});
```

### 4. Auth Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

---

## 📝 Test করার জন্য:

1. **Build করুন:**
   ```bash
   npm run build
   ```

2. **Browser Console check করুন:**
   - "🔍 Login Response" দেখুন
   - "✅ Access Token Found" দেখুন
   - "🔍 Token after storage" দেখুন
   - "🔍 prepareHeaders - Token" দেখুন

3. **Network tab check করুন:**
   - `/auth/login` response দেখুন
   - পরের API calls এ `Authorization: Bearer ...` header যাচ্ছে কিনা দেখুন

---

## 🎯 Final Solution:

এই সমস্যা **Frontend এবং Backend দুই জায়গায়ই** হতে পারে:

- ✅ Frontend fix সম্পূর্ণ হয়েছে
- ❌ Backend fix করতে হবে (CORS + Cookie + Response Structure)

Backend code দেখতে পারলে সেখানেও fix করে দিতে পারব!

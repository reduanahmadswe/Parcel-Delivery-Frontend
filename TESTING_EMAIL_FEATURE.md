# 📧 Email Feature Testing Guide

## ✅ Backend Setup Complete
আপনার backend এ এই features যুক্ত হয়েছে:
- ✅ Email Service (`services/emailService.ts`)
- ✅ Notification Controller (`controllers/notification.controller.ts`)
- ✅ Notification Routes (`routes/notification.routes.ts`)
- ✅ Beautiful Bangla Email Templates
- ✅ Automatic email sending on parcel creation

---

## 🧪 Testing Steps

### 1. Development Server চালু করুন
```bash
npm run dev
```
**Server URL:** http://localhost:5173

---

### 2. Login করুন (Sender Account)
- URL: http://localhost:5173/auth/login
- একটি **sender** account দিয়ে login করুন
- যদি account না থাকে, নতুন register করুন

---

### 3. নতুন Parcel তৈরি করুন

**Navigate to:** http://localhost:5173/sender/create-parcel

**Fill in the form:**

#### 📤 Sender Information:
- Name: আপনার নাম
- Email: আপনার working email (যেখানে email পাবেন)
- Phone: 01XXXXXXXXX
- Address: Complete address

#### 📥 Receiver Information:
- Name: Receiver এর নাম
- **Email: একটি valid email address** ⚠️ (Important - এখানে email পাবে)
- Phone: 01XXXXXXXXX
- Address: Complete delivery address with:
  - Street
  - City/District
  - State/Division
  - Zip Code

#### 📦 Parcel Details:
- Type: Document/Electronics/Clothing/Food/Other
- Weight: 2.5 (kg)
- Dimensions: 30 x 20 x 15 (cm)
- Description: "Test parcel for email verification"
- Is Urgent: Yes/No

---

### 4. Submit করুন এবং Modal Check করুন

**Expected Behavior:**
1. ✅ Submit করার সাথে সাথে parcel create হবে
2. ✅ **ParcelCreatedModal** appear করবে with:
   - 🎉 সুন্দর gradient header
   - ✅ Green badge: "📧 Notification emails sent automatically to both parties"
   - 📦 Tracking ID (blue card)
   - 👤 Sender & Receiver info (purple/pink card)
   - 4 Action Buttons:
     - Download PDF
     - Copy Text
     - Share Tracking Link
     - View Parcel Details

**⚠️ Important:** "Send Email" button থাকবে না (automatically sent)

---

### 5. Email Check করুন 📧

#### Sender Email Check:
1. আপনার email inbox খুলুন (যেটা sender info তে দিয়েছিলেন)
2. Email subject: `✅ আপনার পার্সেল সফলভাবে পাঠানো হয়েছে - [Tracking ID]`
3. Email এ থাকবে:
   - 🎉 "আপনার পার্সেল সফলভাবে পাঠানো হয়েছে!" header
   - 📦 Tracking ID (bold, centered)
   - 🚚 "Track Your Parcel" button
   - 📋 Parcel details (receiver, type, weight, description)
   - Beautiful gradient colors and styling
   - Bangla text with professional design

#### Receiver Email Check:
1. Receiver এর email inbox খুলুন (যেটা receiver info তে দিয়েছিলেন)
2. Email subject: `📦 আপনার জন্য একটি পার্সেল আসছে - [Tracking ID]`
3. Email এ থাকবে:
   - 🎁 "আপনার জন্য একটি পার্সেল আসছে!" header
   - 📦 Tracking ID (bold, centered)
   - 🚚 "Track Your Parcel" button
   - 📋 Parcel details (sender, delivery address, type, weight)
   - Bangla instructions
   - Professional gradient design

---

## 🔍 Email Template Verification Checklist

### Sender Email Template:
- [ ] Subject line তে Tracking ID আছে
- [ ] Bangla text properly displayed হচ্ছে
- [ ] Gradient header (purple/blue) দেখাচ্ছে
- [ ] Tracking ID clearly visible (large, monospace font)
- [ ] "Track Your Parcel" button working (clicks to tracking page)
- [ ] Receiver information correctly showing
- [ ] Parcel details (type, weight, description) showing
- [ ] Footer links working
- [ ] Mobile responsive (if checking on phone)

### Receiver Email Template:
- [ ] Subject line তে Tracking ID আছে
- [ ] Bangla text properly displayed হচ্ছে
- [ ] Gradient header (pink/red) দেখাচ্ছে
- [ ] Tracking ID clearly visible
- [ ] "Track Your Parcel" button working
- [ ] Sender name correctly showing
- [ ] Full delivery address showing
- [ ] Parcel details showing
- [ ] Warning message about keeping phone available
- [ ] Footer professional looking

---

## 🎯 Testing Different Scenarios

### Test Case 1: Complete Information
- ✅ All fields filled
- ✅ Both emails provided
- **Expected:** Both emails sent successfully

### Test Case 2: Missing Sender Email
- ❌ No sender email
- ✅ Receiver email provided
- **Expected:** Only receiver gets email

### Test Case 3: Missing Receiver Email
- ✅ Sender email provided
- ❌ No receiver email
- **Expected:** Only sender gets email

### Test Case 4: No Parcel Details
- ✅ Basic info only
- ❌ No type/weight/description
- **Expected:** Email template gracefully handles missing data

---

## 🐛 Troubleshooting

### Email না এলে:

#### 1. Check Backend Logs:
```bash
# Backend terminal এ দেখুন:
✅ Email service is ready to send emails
📧 Sending parcel notification emails...
✅ Sender email sent: [messageId]
✅ Receiver email sent: [messageId]
```

#### 2. Check Frontend Console:
```javascript
// Browser console এ দেখুন:
📧 Sending parcel notification emails...
✅ Notification emails sent successfully
```

#### 3. Backend Environment Variables Check:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=reduanahmadswe@gmail.com
EMAIL_PASSWORD=adqkyrutwvdotqcq
EMAIL_FROM=reduanahmadswe@gmail.com
EMAIL_FROM_NAME=Parcel Delivery System
FRONTEND_URL=http://localhost:5173
```

#### 4. Gmail App Password Verification:
- App password সঠিক আছে কিনা check করুন
- 2FA enabled আছে কিনা
- "Less secure apps" setting check করুন

#### 5. Spam Folder Check:
- Email spam folder এ গিয়ে থাকতে পারে
- Gmail এ "All Mail" check করুন

---

## 📸 Screenshots to Take

For documentation, capture these:
1. ✅ Parcel creation form (filled)
2. ✅ ParcelCreatedModal with email confirmation badge
3. ✅ Sender email in inbox
4. ✅ Receiver email in inbox
5. ✅ Email template design (full email)
6. ✅ Tracking page (clicking from email)

---

## 🎉 Success Criteria

Your email feature is working perfectly if:
- ✅ Modal shows "emails sent automatically" message
- ✅ Sender receives beautiful Bangla email
- ✅ Receiver receives beautiful Bangla email
- ✅ Email templates are properly formatted
- ✅ Tracking links work correctly
- ✅ No errors in console
- ✅ Emails arrive within 10 seconds

---

## 📝 Notes

- **Email Delivery Time:** Usually 2-10 seconds
- **Email Provider:** Gmail SMTP
- **Template Language:** Bangla + English
- **Template Style:** Modern gradient design
- **Responsive:** Works on desktop and mobile email clients

---

## 🚀 Next Steps After Testing

1. ✅ Verify all test cases pass
2. ✅ Take screenshots for documentation
3. ✅ Deploy backend to production (Render)
4. ✅ Update production environment variables
5. ✅ Deploy frontend to production
6. ✅ Test on production environment

---

## 📞 Support

যদি কোন সমস্যা হয়:
1. Backend logs check করুন
2. Frontend console check করুন
3. Email credentials verify করুন
4. Network request check করুন (DevTools > Network)

**Email API Endpoint:**
```
POST https://parcel-delivery-api.onrender.com/api/notifications/send-parcel-emails
```

---

**Happy Testing! 🎉**

# ⚡ Quick Email Test - 5 Minutes

## 🎯 Simple Test Steps

### 1. Start App
```bash
npm run dev
```
Visit: http://localhost:5173

---

### 2. Login
- URL: http://localhost:5173/auth/login
- Login with your sender account

---

### 3. Create Parcel
- URL: http://localhost:5173/sender/create-parcel

**Minimum Required Fields:**

```
Sender:
  Name: Your Name
  Email: your-email@gmail.com  ← You will receive email here
  Phone: 01700000000
  Address: Any address

Receiver:
  Name: Test Receiver
  Email: receiver-email@gmail.com  ← Receiver will get email here
  Phone: 01800000000
  Address: Complete address
  
Parcel:
  Type: Electronics
  Weight: 2
  Description: Test parcel
```

---

### 4. Submit & Check Modal

After clicking "Create Parcel":

**✅ Modal Should Show:**
```
🎉 Parcel Created Successfully!
📧 Notification emails sent automatically to both parties

[Tracking ID in blue card]
[Sender & Receiver info in colored cards]

Buttons:
- Download PDF
- Copy Text  
- Share Tracking Link
- View Parcel Details
```

**❌ NO "Send Email" button** (emails already sent automatically)

---

### 5. Check Emails (Within 10 seconds)

#### Your Inbox (Sender):
**Subject:** ✅ আপনার পার্সেল সফলভাবে পাঠানো হয়েছে - [Tracking ID]

**Content:**
- 📦 Header with gradient
- Tracking ID (big and bold)
- "Track Your Parcel" button
- Receiver info
- Parcel details

#### Receiver's Inbox:
**Subject:** 📦 আপনার জন্য একটি পার্সেল আসছে - [Tracking ID]

**Content:**
- 🎁 Header with gradient  
- Tracking ID
- "Track Your Parcel" button
- Sender name
- Delivery address
- Parcel details

---

## ✅ Success Indicators

- [x] Modal appears instantly
- [x] Green badge shows "emails sent automatically"
- [x] Sender receives email within 10 seconds
- [x] Receiver receives email within 10 seconds
- [x] Email templates look beautiful (gradients, Bangla text)
- [x] Tracking button in email works
- [x] No console errors

---

## ⚠️ If Email Doesn't Arrive

### Check Backend Console:
```
✅ Email service is ready to send emails
📧 Sending parcel notification emails...
✅ Sender email sent: <messageId>
✅ Receiver email sent: <messageId>
```

### Check Browser Console:
```javascript
📧 Sending parcel notification emails...
✅ Notification emails sent successfully
```

### Common Issues:
1. **Spam folder** - Check spam/junk folder
2. **Wrong email** - Verify email address is correct
3. **Backend down** - Make sure backend is running
4. **Wrong credentials** - Check .env EMAIL_USER and EMAIL_PASSWORD

---

## 🎉 That's It!

If you see:
- ✅ Modal with confirmation
- ✅ 2 beautiful emails (sender + receiver)
- ✅ Working tracking links

**Your email feature is PERFECT! 🚀**

---

## 📸 Quick Screenshots

Take 3 screenshots:
1. The modal with email confirmation
2. Sender email (full view)
3. Receiver email (full view)

**Done! 🎊**

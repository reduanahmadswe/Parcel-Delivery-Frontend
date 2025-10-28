Email server and testing instructions
=================================

This project includes a small email server used by the frontend to send parcel notifications after parcel creation. The server is intentionally minimal and uses Nodemailer to forward emails via SMTP.

Files added
- `server/sendEmail.js` — small Express server exposing `POST /send-emails`.
- `.env.email.example` — example environment variables for the email server.

Setup
-----

1. Install server dependencies (from project root):

```powershell
npm install express nodemailer body-parser
```

2. Install frontend dependency for PDF generation (optional):

```powershell
npm install jspdf
```

3. Copy `.env.email.example` to `.env` or configure environment variables in your shell. Example (PowerShell):

```powershell
$env:EMAIL_HOST='smtp.gmail.com';
$env:EMAIL_PORT='587';
$env:EMAIL_SECURE='false';
$env:EMAIL_USER='reduanahmadswe@gmail.com';
$env:EMAIL_PASSWORD='adqkyrutwvdotqcq';
$env:EMAIL_FROM='reduanahmadswe@gmail.com';
$env:EMAIL_FROM_NAME='Parcel Delivery System';
$env:APP_BASE_URL='http://localhost:5173';
node server/sendEmail.js
```

You can also use a `.env` loader or process manager to inject env vars.

Run the server
--------------

Start the server (default port 4000):

```powershell
node server/sendEmail.js
```

The frontend sends a POST request to `http://localhost:4000/send-emails` with the newly-created parcel object. The server will extract sender and receiver emails from the payload and send two emails (if addresses are present).

Testing the flow
----------------

1. Start the frontend (Vite):

```powershell
npm run dev
```

2. Start the email server (see above).

3. Create a parcel in the UI. On success the Parcel Created modal appears. The frontend will attempt to POST to `/send-emails` automatically. You can also press "Send Notification Emails" in the modal to trigger the POST manually.

4. Check the console where the email server runs for sendMail results and any errors.

Notes & Next steps
------------------
- For production use, prefer a transactional email provider (SendGrid, Mailgun, Amazon SES) and replace direct SMTP usage.
- Consider adding queuing (Bull / Redis) and retry logic in the email server.
- For secure deployments, never commit real SMTP credentials into source control — use secret managers.

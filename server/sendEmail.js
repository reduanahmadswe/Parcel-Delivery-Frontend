// Simple Express server that accepts a POST /send-emails
// and sends two emails (sender and receiver) using Nodemailer.
// Usage: node server/sendEmail.js
// Make sure to set EMAIL_* env vars as specified in the project.

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

function createTransporterFromEnv() {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const secure = (process.env.EMAIL_SECURE || "false") === "true";
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

function buildHtmlForParcel(parcel, trackingLink) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #333;">
      <h2 style="color:#e11d48;">ParcelTrack Notification</h2>
      <p>Tracking ID: <strong>${parcel.trackingId || parcel.id}</strong></p>
      <p>Sender: ${parcel.senderName || parcel.sender?.name || "-"}</p>
      <p>Receiver: ${parcel.receiverName || parcel.receiver?.name || parcel.receiverEmail || "-"}</p>
      <p>Weight: ${parcel.parcelDetails?.weight || "-"} kg</p>
      <p>Destination: ${parcel.receiverAddress?.street || ""}, ${parcel.receiverAddress?.city || ""}</p>
      <div style="margin-top:20px;">
        <a href="${trackingLink}" style="background:#e11d48;color:white;padding:10px 14px;border-radius:8px;text-decoration:none;">Track Parcel</a>
      </div>
      <p style="margin-top:12px;color:#666">If you need help, reply to this email or visit ParcelTrack support.</p>
    </div>
  `;
}

app.post("/send-emails", async (req, res) => {
  try {
    const { parcel } = req.body;

    if (!parcel) return res.status(400).send({ error: "Missing parcel" });

    const transporter = createTransporterFromEnv();

    const trackingId = parcel.trackingId || parcel.id;
    const trackingLink = `${process.env.APP_BASE_URL || "http://localhost:5173"}/track?id=${encodeURIComponent(trackingId)}`;

    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const fromName = process.env.EMAIL_FROM_NAME || "Parcel Delivery System";

    const senderMail = {
      from: `${fromName} <${from}>`,
      to: parcel.senderEmail || parcel.sender?.email,
      subject: `Your parcel was created — ${trackingId}`,
      html: buildHtmlForParcel(parcel, trackingLink),
    };

    const receiverMail = {
      from: `${fromName} <${from}>`,
      to: parcel.receiverEmail || parcel.receiver?.email,
      subject: `A parcel was created for you — ${trackingId}`,
      html: buildHtmlForParcel(parcel, trackingLink),
    };

    // send sender
    const results = [];
    if (senderMail.to) {
      const r1 = await transporter.sendMail(senderMail);
      results.push({ to: senderMail.to, result: r1 });
    }

    if (receiverMail.to) {
      const r2 = await transporter.sendMail(receiverMail);
      results.push({ to: receiverMail.to, result: r2 });
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Email server listening on ${PORT}`);
});

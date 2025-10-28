// Enhanced email notification service
// Sends parcel creation emails to sender and receiver via backend API

import api from './ApiConfiguration';

export async function sendParcelEmails(parcel: any): Promise<any> {
  try {
    const trackingId = parcel.trackingId || parcel.id || parcel._id;
    const senderEmail = parcel.senderEmail || parcel.sender?.email;
    const receiverEmail = parcel.receiverEmail || parcel.receiver?.email;
    const senderName = parcel.senderName || parcel.sender?.name || "Valued Customer";
    const receiverName = parcel.receiverName || parcel.receiver?.name || "Recipient";
    
    const trackingLink = `${window.location.origin}/track?id=${encodeURIComponent(trackingId)}`;
    
    const payload = {
      trackingId,
      senderEmail,
      senderName,
      receiverEmail,
      receiverName,
      trackingLink,
      parcelDetails: parcel.parcelDetails || {},
      receiverAddress: parcel.receiverAddress || {}
    };

    console.log("📧 Sending parcel notification emails...", payload);

    // Call backend API to send emails
    const response = await api.post('/notifications/send-parcel-emails', payload);

    console.log("✅ Emails sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Email sending error:", error);
    // Don't throw error - email failure shouldn't block parcel creation
    return { success: false, error: error.message };
  }
}

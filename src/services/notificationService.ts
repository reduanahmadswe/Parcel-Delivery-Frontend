// Enhanced email notification service
// Sends parcel creation emails to sender and receiver

// @ts-ignore - Vite env variables
const EMAIL_SERVER_URL = import.meta.env?.VITE_EMAIL_SERVER_URL || "http://localhost:4000";

export async function sendParcelEmails(parcel: any): Promise<any> {
  try {
    const trackingId = parcel.trackingId || parcel.id || parcel._id;
    const senderEmail = parcel.senderEmail || parcel.sender?.email;
    const receiverEmail = parcel.receiverEmail || parcel.receiver?.email;
    const senderName = parcel.senderName || parcel.sender?.name || "Valued Customer";
    const receiverName = parcel.receiverName || parcel.receiver?.name || "Recipient";
    
    const trackingLink = `${window.location.origin}/track?id=${encodeURIComponent(trackingId)}`;
    
    const payload = {
      parcel: {
        trackingId,
        senderEmail,
        senderName,
        receiverEmail,
        receiverName,
        trackingLink,
        ...parcel
      },
    };

    const response = await fetch(`${EMAIL_SERVER_URL}/send-emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Email server error:", errorText);
      throw new Error(errorText || "Failed to send emails");
    }

    const result = await response.json();
    console.log("✅ Emails sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
}

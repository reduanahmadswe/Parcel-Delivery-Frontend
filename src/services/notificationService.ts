// Frontend service: posts parcel details to a simple server endpoint that will send emails.
// Server should be started separately (see server/sendEmail.js added to repo).
export async function sendParcelEmails(parcel: any) {
  try {
    const payload = {
      parcel,
    };

    // Change URL if your email server runs elsewhere. Default: localhost:4000
    const res = await fetch("http://localhost:4000/send-emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to send emails");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

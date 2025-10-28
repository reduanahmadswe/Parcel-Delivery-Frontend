// Enhanced PDF generation using jsPDF
// Install: npm install jspdf
import { jsPDF } from "jspdf";

export async function generateParcelPdf(parcel: any) {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const primaryColor: [number, number, number] = [16, 185, 129]; // Emerald
    const textColor: [number, number, number] = [31, 41, 55]; // Gray-800
    const lightGray: [number, number, number] = [243, 244, 246]; // Gray-100

    // Header Background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 100, "F");

    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("ParcelTrack", 40, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Delivery Service", 40, 70);

    // Tracking ID Box
    doc.setFillColor(...lightGray);
    doc.roundedRect(40, 120, pageWidth - 80, 60, 8, 8, "F");
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Tracking ID", 50, 140);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const trackingId = parcel.trackingId || parcel.id || parcel._id || "N/A";
    doc.text(trackingId, 50, 165);

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.line(40, 200, pageWidth - 40, 200);

    // Sender & Receiver Info
    let yPos = 230;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Sender Information", 40, yPos);
    
    yPos += 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    const senderName = parcel.senderName || parcel.sender?.name || "N/A";
    const senderEmail = parcel.senderEmail || parcel.sender?.email || "N/A";
    doc.text(`Name: ${senderName}`, 50, yPos);
    yPos += 18;
    doc.text(`Email: ${senderEmail}`, 50, yPos);

    yPos += 35;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Receiver Information", 40, yPos);
    
    yPos += 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    const receiverName = parcel.receiverName || parcel.receiver?.name || "N/A";
    const receiverEmail = parcel.receiverEmail || parcel.receiver?.email || "N/A";
    const receiverPhone = parcel.receiverPhone || parcel.receiver?.phone || "N/A";
    doc.text(`Name: ${receiverName}`, 50, yPos);
    yPos += 18;
    doc.text(`Email: ${receiverEmail}`, 50, yPos);
    yPos += 18;
    doc.text(`Phone: ${receiverPhone}`, 50, yPos);
    
    yPos += 18;
    const addr = parcel.receiverAddress || parcel.receiver?.address || {};
    const fullAddress = `${addr.street || ""}, ${addr.city || ""}, ${addr.state || ""} ${addr.zipCode || ""}`.trim() || "N/A";
    const addressLines = doc.splitTextToSize(`Address: ${fullAddress}`, pageWidth - 100);
    doc.text(addressLines, 50, yPos);
    yPos += addressLines.length * 18;

    // Parcel Details Box
    yPos += 25;
    doc.setFillColor(...lightGray);
    const boxHeight = 120;
    doc.roundedRect(40, yPos, pageWidth - 80, boxHeight, 8, 8, "F");
    
    yPos += 25;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Parcel Details", 50, yPos);
    
    yPos += 25;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    
    const parcelDetails = parcel.parcelDetails || {};
    const type = (parcelDetails.type || parcel.type || "Package").toUpperCase();
    const weight = parcelDetails.weight || parcel.weight || "N/A";
    const dimensions = parcelDetails.dimensions || {};
    const dimText = `${dimensions.length || "-"} × ${dimensions.width || "-"} × ${dimensions.height || "-"} cm`;
    const description = parcelDetails.description || parcel.description || "No description provided";
    
    doc.text(`Type: ${type}`, 50, yPos);
    yPos += 18;
    doc.text(`Weight: ${weight} kg`, 50, yPos);
    yPos += 18;
    doc.text(`Dimensions (L × W × H): ${dimText}`, 50, yPos);
    yPos += 18;
    const descLines = doc.splitTextToSize(`Description: ${description}`, pageWidth - 100);
    doc.text(descLines, 50, yPos);

    // QR Code placeholder (optional - requires qrcode library)
    // You can add QR code generation here if needed

    // Footer
    const footerY = pageHeight - 60;
    doc.setDrawColor(229, 231, 235);
    doc.line(40, footerY - 10, pageWidth - 40, footerY - 10);
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, footerY);
    doc.text("ParcelTrack © 2025 - Professional Delivery Services", 40, footerY + 15);
    doc.text(`Track online: ${window.location.origin}/track?id=${trackingId}`, 40, footerY + 30);

    // Save PDF
    doc.save(`parcel_${trackingId}_${Date.now()}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

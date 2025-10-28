// Professional PDF generation using jsPDF with modern design and QR code
// Install: npm install jspdf qrcode
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function generateParcelPdf(parcel: any) {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Project Theme Colors (matching the modal and UI)
    const green: [number, number, number] = [34, 197, 94]; // Green-500 (from modal header gradient)
    const emerald: [number, number, number] = [16, 185, 129]; // Emerald-500
    const blue: [number, number, number] = [59, 130, 246]; // Blue-500
    const purple: [number, number, number] = [168, 85, 247]; // Purple-500
    const pink: [number, number, number] = [236, 72, 153]; // Pink-500
    const amber: [number, number, number] = [245, 158, 11]; // Amber-500
    const gray900: [number, number, number] = [17, 24, 39]; // Gray-900 (dark text)
    const gray700: [number, number, number] = [55, 65, 81]; // Gray-700
    const gray500: [number, number, number] = [107, 114, 128]; // Gray-500
    const gray100: [number, number, number] = [243, 244, 246]; // Gray-100 (light bg)
    const white: [number, number, number] = [255, 255, 255];

    // Extract all data from parcel
    const trackingId = parcel.trackingId || parcel.id || parcel._id || "N/A";
    
    // Sender info
    const senderName = parcel.senderInfo?.name || parcel.senderName || parcel.sender?.name || "You";
    const senderEmail = parcel.senderInfo?.email || parcel.senderEmail || parcel.sender?.email || "N/A";
    const senderPhone = parcel.senderInfo?.phone || parcel.senderPhone || parcel.sender?.phone || "N/A";
    
    // Receiver info
    const receiverName = parcel.receiverInfo?.name || parcel.receiverName || parcel.receiver?.name || "N/A";
    const receiverEmail = parcel.receiverInfo?.email || parcel.receiverEmail || parcel.receiver?.email || "N/A";
    const receiverPhone = parcel.receiverInfo?.phone || parcel.receiverPhone || parcel.receiver?.phone || "N/A";
    
    // Address
    const address = parcel.receiverInfo?.address || parcel.receiverAddress || parcel.receiver?.address || {};
    const fullAddress = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(Boolean).join(", ") || "No address provided";
    
    // Parcel details
    const parcelDetails = parcel.parcelDetails || {};
    const parcelType = (parcelDetails.type || parcel.type || "Package").toUpperCase();
    const weight = parcelDetails.weight || parcel.weight || "N/A";
    const dimensions = parcelDetails.dimensions || parcel.dimensions || {};
    const dimText = dimensions.length && dimensions.width && dimensions.height 
      ? `${dimensions.length} × ${dimensions.width} × ${dimensions.height} cm`
      : "N/A";
    const description = parcelDetails.description || parcel.description || "No description provided";

    // ==================== HEADER ====================
    // Gradient background effect (green to emerald)
    doc.setFillColor(34, 197, 94); // Green-500
    doc.rect(0, 0, pageWidth, 120, "F");
    
    // Accent stripe
    doc.setFillColor(16, 185, 129); // Emerald-500
    doc.rect(0, 110, pageWidth, 10, "F");

    // Logo/Title
    doc.setTextColor(...white);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("ParcelTrack", 40, 55);
    
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Delivery Service", 40, 80);
    
    // Date on right side
    doc.setFontSize(10);
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(dateStr, pageWidth - 40, 55, { align: "right" });

    // ==================== TRACKING ID SECTION ====================
    let yPos = 155;
    
    // Blue gradient box for tracking ID
    doc.setFillColor(219, 234, 254); // Blue-100
    doc.roundedRect(40, yPos, pageWidth - 80, 70, 10, 10, "F");
    
    // Border
    doc.setDrawColor(59, 130, 246); // Blue-500
    doc.setLineWidth(2);
    doc.roundedRect(40, yPos, pageWidth - 80, 70, 10, 10, "S");
    
    yPos += 25;
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("📦 TRACKING ID", 55, yPos);
    
    yPos += 25;
    doc.setTextColor(30, 58, 138); // Blue-900
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(trackingId, 55, yPos);

    // ==================== SENDER & RECEIVER SECTION ====================
    yPos += 50;
    
    // Two-column layout
    const leftCol = 40;
    const rightCol = pageWidth / 2 + 20;
    const colWidth = (pageWidth / 2) - 60;

    // SENDER BOX (Purple theme)
    doc.setFillColor(250, 245, 255); // Purple-50
    doc.roundedRect(leftCol, yPos, colWidth, 120, 8, 8, "F");
    doc.setDrawColor(168, 85, 247); // Purple-500
    doc.setLineWidth(1.5);
    doc.roundedRect(leftCol, yPos, colWidth, 120, 8, 8, "S");
    
    let senderY = yPos + 25;
    doc.setTextColor(126, 34, 206); // Purple-700
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("👤 Sender", leftCol + 15, senderY);
    
    senderY += 25;
    doc.setTextColor(...gray900);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", leftCol + 15, senderY);
    doc.setFont("helvetica", "normal");
    const senderNameLines = doc.splitTextToSize(senderName, colWidth - 70);
    doc.text(senderNameLines, leftCol + 60, senderY);
    
    senderY += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", leftCol + 15, senderY);
    doc.setFont("helvetica", "normal");
    const senderEmailLines = doc.splitTextToSize(senderEmail, colWidth - 70);
    doc.text(senderEmailLines, leftCol + 60, senderY);
    
    senderY += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", leftCol + 15, senderY);
    doc.setFont("helvetica", "normal");
    doc.text(senderPhone, leftCol + 60, senderY);

    // RECEIVER BOX (Pink theme)
    doc.setFillColor(253, 242, 248); // Pink-50
    doc.roundedRect(rightCol, yPos, colWidth, 120, 8, 8, "F");
    doc.setDrawColor(236, 72, 153); // Pink-500
    doc.setLineWidth(1.5);
    doc.roundedRect(rightCol, yPos, colWidth, 120, 8, 8, "S");
    
    let receiverY = yPos + 25;
    doc.setTextColor(219, 39, 119); // Pink-600
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("📍 Receiver", rightCol + 15, receiverY);
    
    receiverY += 25;
    doc.setTextColor(...gray900);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", rightCol + 15, receiverY);
    doc.setFont("helvetica", "normal");
    const receiverNameLines = doc.splitTextToSize(receiverName, colWidth - 70);
    doc.text(receiverNameLines, rightCol + 60, receiverY);
    
    receiverY += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", rightCol + 15, receiverY);
    doc.setFont("helvetica", "normal");
    const receiverEmailLines = doc.splitTextToSize(receiverEmail, colWidth - 70);
    doc.text(receiverEmailLines, rightCol + 60, receiverY);
    
    receiverY += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", rightCol + 15, receiverY);
    doc.setFont("helvetica", "normal");
    doc.text(receiverPhone, rightCol + 60, receiverY);

    // ==================== DELIVERY ADDRESS SECTION ====================
    yPos += 145;
    
    // Amber theme box
    doc.setFillColor(254, 243, 199); // Amber-100
    doc.roundedRect(40, yPos, pageWidth - 80, 75, 8, 8, "F");
    doc.setDrawColor(245, 158, 11); // Amber-500
    doc.setLineWidth(1.5);
    doc.roundedRect(40, yPos, pageWidth - 80, 75, 8, 8, "S");
    
    yPos += 25;
    doc.setTextColor(180, 83, 9); // Amber-700
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("🏠 Delivery Address", 55, yPos);
    
    yPos += 25;
    doc.setTextColor(...gray900);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(fullAddress, pageWidth - 110);
    doc.text(addressLines, 55, yPos);

    // ==================== PARCEL DETAILS SECTION ====================
    yPos += 75;
    
    // Gray box with border
    doc.setFillColor(249, 250, 251); // Gray-50
    doc.roundedRect(40, yPos, pageWidth - 80, 140, 8, 8, "F");
    doc.setDrawColor(156, 163, 175); // Gray-400
    doc.setLineWidth(1.5);
    doc.roundedRect(40, yPos, pageWidth - 80, 140, 8, 8, "S");
    
    yPos += 25;
    doc.setTextColor(...gray900);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("📦 Parcel Details", 55, yPos);
    
    yPos += 25;
    doc.setFontSize(10);
    
    // Grid layout for details
    doc.setFont("helvetica", "bold");
    doc.text("Type:", 55, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(parcelType, 120, yPos);
    
    doc.setFont("helvetica", "bold");
    doc.text("Weight:", pageWidth / 2 + 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${weight} kg`, pageWidth / 2 + 80, yPos);
    
    yPos += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Dimensions:", 55, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(dimText, 120, yPos);
    
    yPos += 25;
    doc.setFont("helvetica", "bold");
    doc.text("Description:", 55, yPos);
    yPos += 15;
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(description, pageWidth - 110);
    doc.text(descLines, 55, yPos);

    // ==================== FOOTER ====================
    const footerY = pageHeight - 120; // Increased space for QR code
    
    // Divider line
    doc.setDrawColor(...gray500);
    doc.setLineWidth(0.5);
    doc.line(40, footerY - 15, pageWidth - 40, footerY - 15);
    
    // Generate QR Code for tracking link
    const trackLink = `${window.location.origin}/track?id=${trackingId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackLink, {
      width: 100,
      margin: 1,
      color: {
        dark: '#111827', // Gray-900
        light: '#FFFFFF'
      }
    });
    
    // QR Code Box (Right side)
    const qrSize = 90;
    const qrX = pageWidth - 40 - qrSize;
    const qrY = footerY - 10;
    
    // QR Code background
    doc.setFillColor(249, 250, 251); // Gray-50
    doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 5, 5, "F");
    
    // Add QR code image
    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    
    // QR Code label below
    doc.setFontSize(8);
    doc.setTextColor(...gray700);
    doc.setFont("helvetica", "bold");
    doc.text("Scan to Track", qrX + qrSize / 2, qrY + qrSize + 12, { align: "center" });
    
    // Footer text (Left side)
    doc.setFontSize(9);
    doc.setTextColor(...gray500);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    })}`, 40, footerY);
    
    doc.setFont("helvetica", "bold");
    doc.text("ParcelTrack © 2025", 40, footerY + 15);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Delivery Services", 40, footerY + 28);
    
    // Tracking link text
    doc.setFontSize(8);
    doc.setTextColor(59, 130, 246); // Blue-500 for link
    const maxLinkWidth = qrX - 60; // Space before QR code
    const trackLinkLines = doc.splitTextToSize(`Track online: ${trackLink}`, maxLinkWidth);
    doc.text(trackLinkLines, 40, footerY + 45);
    
    // Watermark/Badge
    doc.setFontSize(7);
    doc.setTextColor(...gray500);
    doc.text("Document verified and generated by ParcelTrack System", qrX + qrSize / 2, qrY + qrSize + 24, { align: "center" });

    // Save PDF with descriptive filename
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`ParcelTrack_${trackingId}_${timestamp}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

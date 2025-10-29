// Professional PDF generation using jsPDF with modern design and QR code
// Install: npm install jspdf qrcode
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function generateParcelPdf(parcel: any) {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Project Theme Colors (Red/White combination from project)
    const primaryRed: [number, number, number] = [239, 68, 68]; // Red-500 (Primary brand color)
    const darkRed: [number, number, number] = [220, 38, 38]; // Red-600
    const lightRed: [number, number, number] = [254, 226, 226]; // Red-100
    const blue: [number, number, number] = [59, 130, 246]; // Blue-500
    const purple: [number, number, number] = [147, 51, 234]; // Purple-600
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

    // ==================== MODERN HEADER ====================
    // Main red gradient background
    doc.setFillColor(...primaryRed);
    doc.rect(0, 0, pageWidth, 100, "F");
    
    // Darker red accent stripe at bottom
    doc.setFillColor(...darkRed);
    doc.rect(0, 90, pageWidth, 10, "F");
    
    // Decorative white accent line
    doc.setFillColor(...white);
    doc.rect(0, 85, pageWidth, 2, "F");

    // Logo/Title with shadow effect
    doc.setTextColor(...white);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("ParcelTrack", 40, 50);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Delivery Service", 40, 70);
    
    // Date badge on right side with white background
    doc.setFontSize(9);
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // White date box
    const dateWidth = doc.getTextWidth(dateStr) + 20;
    doc.setFillColor(...white);
    doc.roundedRect(pageWidth - dateWidth - 40, 35, dateWidth, 25, 3, 3, "F");
    
    doc.setTextColor(...primaryRed);
    doc.setFont("helvetica", "bold");
    doc.text(dateStr, pageWidth - 40 - dateWidth / 2, 50, { align: "center" });

    // ==================== TRACKING ID SECTION ====================
    let yPos = 130;
    
    // Light blue background for tracking ID
    doc.setFillColor(219, 234, 254); // Blue-100
    doc.roundedRect(40, yPos, pageWidth - 80, 65, 10, 10, "F");
    
    // Blue border
    doc.setDrawColor(...blue);
    doc.setLineWidth(2);
    doc.roundedRect(40, yPos, pageWidth - 80, 65, 10, 10, "S");
    
    yPos += 22;
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TRACKING ID", 55, yPos);
    
    yPos += 23;
    doc.setTextColor(30, 58, 138); // Blue-900
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(trackingId, 55, yPos);

    // ==================== SENDER & RECEIVER SECTION ====================
    yPos += 40;
    
    // Two-column layout
    const leftCol = 40;
    const rightCol = pageWidth / 2 + 20;
    const colWidth = (pageWidth / 2) - 60;

    // SENDER BOX (Purple theme)
    doc.setFillColor(245, 243, 255); // Purple-50
    doc.roundedRect(leftCol, yPos, colWidth, 110, 8, 8, "F");
    doc.setDrawColor(...purple);
    doc.setLineWidth(1.5);
    doc.roundedRect(leftCol, yPos, colWidth, 110, 8, 8, "S");
    
    let senderY = yPos + 22;
    doc.setTextColor(...purple);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Sender", leftCol + 15, senderY);
    
    senderY += 20;
    doc.setTextColor(...gray900);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", leftCol + 15, senderY);
    doc.setFont("helvetica", "normal");
    const senderNameLines = doc.splitTextToSize(senderName, colWidth - 60);
    doc.text(senderNameLines, leftCol + 50, senderY);
    
    senderY += 18;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", leftCol + 15, senderY);
    doc.setFont("helvetica", "normal");
    const senderEmailLines = doc.splitTextToSize(senderEmail, colWidth - 60);
    doc.text(senderEmailLines, leftCol + 50, senderY);
    
    senderY += 18;
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", leftCol + 15, senderY);
    doc.setFont("helvetica", "normal");
    doc.text(senderPhone, leftCol + 50, senderY);

    // RECEIVER BOX (Pink theme)
    doc.setFillColor(253, 242, 248); // Pink-50
    doc.roundedRect(rightCol, yPos, colWidth, 110, 8, 8, "F");
    doc.setDrawColor(...pink);
    doc.setLineWidth(1.5);
    doc.roundedRect(rightCol, yPos, colWidth, 110, 8, 8, "S");
    
    let receiverY = yPos + 22;
    doc.setTextColor(...pink);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Receiver", rightCol + 15, receiverY);
    
    receiverY += 20;
    doc.setTextColor(...gray900);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", rightCol + 15, receiverY);
    doc.setFont("helvetica", "normal");
    const receiverNameLines = doc.splitTextToSize(receiverName, colWidth - 60);
    doc.text(receiverNameLines, rightCol + 50, receiverY);
    
    receiverY += 18;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", rightCol + 15, receiverY);
    doc.setFont("helvetica", "normal");
    const receiverEmailLines = doc.splitTextToSize(receiverEmail, colWidth - 60);
    doc.text(receiverEmailLines, rightCol + 50, receiverY);
    
    receiverY += 18;
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", rightCol + 15, receiverY);
    doc.setFont("helvetica", "normal");
    doc.text(receiverPhone, rightCol + 50, receiverY);

    // ==================== DELIVERY ADDRESS SECTION ====================
    yPos += 130;
    
    // Amber theme box
    doc.setFillColor(254, 243, 199); // Amber-100
    doc.roundedRect(40, yPos, pageWidth - 80, 65, 8, 8, "F");
    doc.setDrawColor(...amber);
    doc.setLineWidth(1.5);
    doc.roundedRect(40, yPos, pageWidth - 80, 65, 8, 8, "S");
    
    yPos += 22;
    doc.setTextColor(180, 83, 9); // Amber-700
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Delivery Address", 55, yPos);
    
    yPos += 20;
    doc.setTextColor(...gray900);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(fullAddress, pageWidth - 110);
    doc.text(addressLines, 55, yPos);

    // ==================== PARCEL DETAILS SECTION ====================
    yPos += 55;
    
    // Gray box with border
    doc.setFillColor(249, 250, 251); // Gray-50
    doc.roundedRect(40, yPos, pageWidth - 80, 125, 8, 8, "F");
    doc.setDrawColor(...gray500);
    doc.setLineWidth(1.5);
    doc.roundedRect(40, yPos, pageWidth - 80, 125, 8, 8, "S");
    
    yPos += 22;
    doc.setTextColor(...gray900);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Parcel Details", 55, yPos);
    
    yPos += 22;
    doc.setFontSize(9);
    
    // Grid layout for details
    doc.setFont("helvetica", "bold");
    doc.text("Type:", 55, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(parcelType, 110, yPos);
    
    doc.setFont("helvetica", "bold");
    doc.text("Weight:", pageWidth / 2 + 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${weight} kg`, pageWidth / 2 + 70, yPos);
    
    yPos += 18;
    doc.setFont("helvetica", "bold");
    doc.text("Dimensions:", 55, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(dimText, 110, yPos);
    
    yPos += 22;
    doc.setFont("helvetica", "bold");
    doc.text("Description:", 55, yPos);
    yPos += 13;
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(description, pageWidth - 110);
    doc.text(descLines, 55, yPos);

    // ==================== QR CODE SECTION ====================
    yPos += Math.max(descLines.length * 13, 25); // Space after description
    
    // Generate QR Code for tracking link
    const trackLink = `${window.location.origin}/track?id=${trackingId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackLink, {
      width: 120,
      margin: 1,
      color: {
        dark: '#111827', // Gray-900
        light: '#FFFFFF'
      }
    });
    
    // QR Code section (centered)
    const qrSize = 100;
    const qrX = (pageWidth - qrSize) / 2; // Center horizontally
    const qrY = yPos;
    
    // QR Code background with border
    doc.setFillColor(...white);
    doc.roundedRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 30, 8, 8, "F");
    doc.setDrawColor(...primaryRed);
    doc.setLineWidth(1.5);
    doc.roundedRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 30, 8, 8, "S");
    
    // Add QR code image
    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    
    // QR Code label below
    doc.setFontSize(10);
    doc.setTextColor(...primaryRed);
    doc.setFont("helvetica", "bold");
    doc.text("Scan to Track Parcel", pageWidth / 2, qrY + qrSize + 15, { align: "center" });

    // ==================== FOOTER ====================
    const footerY = pageHeight - 40;
    
    // Divider line
    doc.setDrawColor(...gray500);
    doc.setLineWidth(0.5);
    doc.line(40, footerY - 12, pageWidth - 40, footerY - 12);
    
    // Footer text (Left side)
    doc.setFontSize(8);
    doc.setTextColor(...gray500);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    })}`, 40, footerY);
    
    // Footer right side
    doc.setFont("helvetica", "bold");
    doc.text("ParcelTrack © 2025", pageWidth - 40, footerY, { align: "right" });

    // Save PDF with descriptive filename
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`ParcelTrack_${trackingId}_${timestamp}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

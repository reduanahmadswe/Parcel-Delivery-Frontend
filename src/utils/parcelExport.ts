

import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function generateParcelPdf(parcel: any) {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primaryRed: [number, number, number] = [239, 68, 68]; 
    const darkRed: [number, number, number] = [220, 38, 38]; 
    const lightRed: [number, number, number] = [254, 226, 226]; 
    const blue: [number, number, number] = [59, 130, 246]; 
    const purple: [number, number, number] = [147, 51, 234]; 
    const pink: [number, number, number] = [236, 72, 153]; 
    const amber: [number, number, number] = [245, 158, 11]; 
    const gray900: [number, number, number] = [17, 24, 39]; 
    const gray700: [number, number, number] = [55, 65, 81]; 
    const gray500: [number, number, number] = [107, 114, 128]; 
    const gray100: [number, number, number] = [243, 244, 246]; 
    const white: [number, number, number] = [255, 255, 255];

    const trackingId = parcel.trackingId || parcel.id || parcel._id || "N/A";

    const senderName = parcel.senderInfo?.name || parcel.senderName || parcel.sender?.name || "You";
    const senderEmail = parcel.senderInfo?.email || parcel.senderEmail || parcel.sender?.email || "N/A";
    const senderPhone = parcel.senderInfo?.phone || parcel.senderPhone || parcel.sender?.phone || "N/A";

    const receiverName = parcel.receiverInfo?.name || parcel.receiverName || parcel.receiver?.name || "N/A";
    const receiverEmail = parcel.receiverInfo?.email || parcel.receiverEmail || parcel.receiver?.email || "N/A";
    const receiverPhone = parcel.receiverInfo?.phone || parcel.receiverPhone || parcel.receiver?.phone || "N/A";

    const address = parcel.receiverInfo?.address || parcel.receiverAddress || parcel.receiver?.address || {};
    const fullAddress = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(Boolean).join(", ") || "No address provided";

    const parcelDetails = parcel.parcelDetails || {};
    const parcelType = (parcelDetails.type || parcel.type || "Package").toUpperCase();
    const weight = parcelDetails.weight || parcel.weight || "N/A";
    const dimensions = parcelDetails.dimensions || parcel.dimensions || {};
    const dimText = dimensions.length && dimensions.width && dimensions.height 
      ? `${dimensions.length} × ${dimensions.width} × ${dimensions.height} cm`
      : "N/A";
    const description = parcelDetails.description || parcel.description || "No description provided";

    doc.setFillColor(...primaryRed);
    doc.rect(0, 0, pageWidth, 100, "F");

    doc.setFillColor(...darkRed);
    doc.rect(0, 90, pageWidth, 10, "F");

    doc.setFillColor(...white);
    doc.rect(0, 85, pageWidth, 2, "F");

    doc.setTextColor(...white);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("ParcelTrack", 40, 50);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Delivery Service", 40, 70);

    doc.setFontSize(9);
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const dateWidth = doc.getTextWidth(dateStr) + 20;
    doc.setFillColor(...white);
    doc.roundedRect(pageWidth - dateWidth - 40, 35, dateWidth, 25, 3, 3, "F");
    
    doc.setTextColor(...primaryRed);
    doc.setFont("helvetica", "bold");
    doc.text(dateStr, pageWidth - 40 - dateWidth / 2, 50, { align: "center" });

    let yPos = 130;

    doc.setFillColor(219, 234, 254); 
    doc.roundedRect(40, yPos, pageWidth - 80, 65, 10, 10, "F");

    doc.setDrawColor(...blue);
    doc.setLineWidth(2);
    doc.roundedRect(40, yPos, pageWidth - 80, 65, 10, 10, "S");
    
    yPos += 22;
    doc.setTextColor(37, 99, 235); 
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TRACKING ID", 55, yPos);
    
    yPos += 23;
    doc.setTextColor(30, 58, 138); 
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(trackingId, 55, yPos);

    yPos += 40;

    const leftCol = 40;
    const rightCol = pageWidth / 2 + 20;
    const colWidth = (pageWidth / 2) - 60;

    doc.setFillColor(245, 243, 255); 
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

    doc.setFillColor(253, 242, 248); 
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

    yPos += 130;

    doc.setFillColor(254, 243, 199); 
    doc.roundedRect(40, yPos, pageWidth - 80, 65, 8, 8, "F");
    doc.setDrawColor(...amber);
    doc.setLineWidth(1.5);
    doc.roundedRect(40, yPos, pageWidth - 80, 65, 8, 8, "S");
    
    yPos += 22;
    doc.setTextColor(180, 83, 9); 
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Delivery Address", 55, yPos);
    
    yPos += 20;
    doc.setTextColor(...gray900);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(fullAddress, pageWidth - 110);
    doc.text(addressLines, 55, yPos);

    yPos += 55;
    
    const parcelDetailsStartY = yPos; 

    const descLines = doc.splitTextToSize(description, pageWidth - 110);
    const descHeight = descLines.length * 13;

    const parcelDetailsHeight = 22 + 22 + 18 + 18 + 22 + 13 + descHeight + 15; 

    doc.setFillColor(255, 255, 255); 
    doc.roundedRect(40, parcelDetailsStartY, pageWidth - 80, parcelDetailsHeight, 8, 8, "F");
    doc.setDrawColor(...gray500);
    doc.setLineWidth(1.5);
    doc.roundedRect(40, parcelDetailsStartY, pageWidth - 80, parcelDetailsHeight, 8, 8, "S");

    yPos += 22;
    doc.setTextColor(...gray900);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Parcel Details", 55, yPos);
    
    yPos += 22;
    doc.setFontSize(10);
    doc.setTextColor(...gray900);

    doc.setFont("helvetica", "bold");
    doc.text("Type:", 55, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(parcelType.toUpperCase(), 110, yPos);
    
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
    doc.text(descLines, 55, yPos);

    yPos = parcelDetailsStartY + parcelDetailsHeight;

    yPos += 30; 

    const trackLink = `${window.location.origin}/track?id=${trackingId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackLink, {
      width: 150,
      margin: 2,
      color: {
        dark: '#DC2626', 
        light: '#FFFFFF'
      }
    });

    const qrSize = 110;
    const qrBoxWidth = qrSize + 40;
    const qrBoxHeight = qrSize + 50;
    const qrX = (pageWidth - qrSize) / 2; 
    const qrBoxX = (pageWidth - qrBoxWidth) / 2; 
    const qrY = yPos + 15;

    doc.setFillColor(254, 242, 242); 
    doc.roundedRect(qrBoxX, yPos, qrBoxWidth, qrBoxHeight, 10, 10, "F");

    doc.setDrawColor(...primaryRed);
    doc.setLineWidth(2);
    doc.roundedRect(qrBoxX, yPos, qrBoxWidth, qrBoxHeight, 10, 10, "S");

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 6, 6, "F");
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(1);
    doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 6, 6, "S");

    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    doc.setFontSize(11);
    doc.setTextColor(...primaryRed);
    doc.setFont("helvetica", "bold");
    doc.text("Scan to Track", pageWidth / 2, qrY + qrSize + 20, { align: "center" });

    const footerY = pageHeight - 30;

    doc.setDrawColor(229, 231, 235); 
    doc.setLineWidth(0.5);
    doc.line(40, footerY - 15, pageWidth - 40, footerY - 15);

    doc.setFontSize(8);
    doc.setTextColor(...gray500);
    doc.setFont("helvetica", "normal");

    const timestamp = new Date().toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });
    doc.text(`Generated: ${timestamp}`, 40, footerY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryRed);
    doc.text("ParcelTrack", pageWidth / 2, footerY, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray500);
    doc.text("© 2025", pageWidth - 40, footerY, { align: "right" });

    const fileTimestamp = new Date().toISOString().split('T')[0];
    doc.save(`ParcelTrack_${trackingId}_${fileTimestamp}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

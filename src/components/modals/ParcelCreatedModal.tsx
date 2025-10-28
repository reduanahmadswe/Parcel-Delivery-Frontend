import React, { useState } from "react";
import { Parcel } from "@/types/GlobalTypeDefinitions";
import { Download, Link as LinkIcon, FileText, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { generateParcelPdf } from "../../utils/parcelExport";
import { sendParcelEmails } from "../../services/notificationService";
import { useNavigate } from "react-router-dom";

interface Props {
  parcel: any; // parcel object returned from API
  onClose: () => void;
}

export default function ParcelCreatedModal({ parcel, onClose }: Props) {
  const navigate = useNavigate();
  const [sendingEmails, setSendingEmails] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  if (!parcel) return null;

  const trackingId = parcel.trackingId || parcel.id || "-";

  const parcelText = () => {
    return `Tracking ID: ${trackingId}\nSender: ${parcel.senderName || parcel.sender?.name || "-"}\nReceiver: ${parcel.receiverName || parcel.receiver?.name || parcel.receiverEmail || "-"}\nAddress: ${parcel.receiverAddress?.street || ""}, ${parcel.receiverAddress?.city || ""}, ${parcel.receiverAddress?.state || ""} ${parcel.receiverAddress?.zipCode || ""}\nType: ${parcel.parcelDetails?.type || parcel.type || "-"}\nWeight: ${parcel.parcelDetails?.weight || "-"} kg\nDimensions: ${parcel.parcelDetails?.dimensions?.length || ""} x ${parcel.parcelDetails?.dimensions?.width || ""} x ${parcel.parcelDetails?.dimensions?.height || ""} cm\nDescription: ${parcel.parcelDetails?.description || "-"}`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(parcelText());
      toast.success("Parcel info copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy parcel info");
    }
  };

  const handleGeneratePdf = async () => {
    try {
      setGeneratingPdf(true);
      await generateParcelPdf(parcel);
      toast.success("PDF generated / downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleShareTrackingLink = async () => {
    const link = `${window.location.origin}/track?id=${encodeURIComponent(trackingId)}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Tracking link copied to clipboard");
      // Optionally open in new tab
      // window.open(link, '_blank');
    } catch (err) {
      toast.error("Failed to copy tracking link");
    }
  };

  const handleSendEmails = async () => {
    setSendingEmails(true);
    try {
      await sendParcelEmails(parcel);
      toast.success("Notification emails queued/sent");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notification emails");
    } finally {
      setSendingEmails(false);
    }
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/parcels/${trackingId}`);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">Parcel Created</h3>
            <p className="text-sm text-muted-foreground mt-1">Parcel was created successfully. You can copy, download or share the details below.</p>
          </div>
          <div>
            <button className="text-muted-foreground hover:text-foreground" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/10 rounded-lg">
            <div className="text-xs text-muted-foreground">Tracking ID</div>
            <div className="font-mono font-semibold mt-1">{trackingId}</div>
          </div>

          <div className="p-4 bg-muted/10 rounded-lg">
            <div className="text-xs text-muted-foreground">Sender</div>
            <div className="mt-1">{parcel.senderName || parcel.sender?.name || "-"}</div>
            <div className="text-xs text-muted-foreground">Receiver</div>
            <div className="mt-1">{parcel.receiverName || parcel.receiver?.name || parcel.receiverEmail || "-"}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted/5 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Parcel summary</div>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{parcelText()}</div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
          <button onClick={handleGeneratePdf} disabled={generatingPdf} className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:shadow transition">
            <Download className="w-4 h-4" />
            <span>{generatingPdf ? "Generating..." : "Share as PDF"}</span>
          </button>

          <button onClick={handleCopyText} className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:shadow transition">
            <FileText className="w-4 h-4" />
            Copy as Text
          </button>

          <button onClick={handleShareTrackingLink} className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:shadow transition">
            <LinkIcon className="w-4 h-4" />
            Share Tracking Link
          </button>

          <button onClick={handleSendEmails} disabled={sendingEmails} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow transition">
            <Eye className="w-4 h-4" />
            <span>{sendingEmails ? "Sending..." : "Send Notification Emails"}</span>
          </button>

          <button onClick={handleViewDetails} className="inline-flex items-center gap-2 px-4 py-2 bg-muted/10 rounded-lg">
            View Parcel Details
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Download, Link as LinkIcon, FileText, Eye, CheckCircle2, Package, User, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { generateParcelPdf } from "../../utils/parcelExport";
import { useNavigate } from "react-router-dom";

interface Props {
  parcel: any; // parcel object returned from API
  onClose: () => void;
}

export default function ParcelCreatedModal({ parcel, onClose }: Props) {
  const navigate = useNavigate();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  if (!parcel) return null;

  // Debug: Log parcel structure to console
  console.log("📦 Parcel data in modal:", parcel);

  const trackingId = parcel.trackingId || parcel.id || "-";
  
  // Extract sender and receiver info from different possible structures
  const senderName = parcel.senderInfo?.name || parcel.senderName || parcel.sender?.name || "-";
  const receiverName = parcel.receiverInfo?.name || parcel.receiverName || parcel.receiver?.name || "-";
  const receiverEmail = parcel.receiverInfo?.email || parcel.receiverEmail || parcel.receiver?.email || "-";

  const parcelText = () => {
    return `Tracking ID: ${trackingId}\nSender: ${senderName}\nReceiver: ${receiverName}\nEmail: ${receiverEmail}\nAddress: ${parcel.receiverInfo?.address?.street || parcel.receiverAddress?.street || ""}, ${parcel.receiverInfo?.address?.city || parcel.receiverAddress?.city || ""}, ${parcel.receiverInfo?.address?.state || parcel.receiverAddress?.state || ""} ${parcel.receiverInfo?.address?.zipCode || parcel.receiverAddress?.zipCode || ""}\nType: ${parcel.parcelDetails?.type || parcel.type || "-"}\nWeight: ${parcel.parcelDetails?.weight || "-"} kg\nDimensions: ${parcel.parcelDetails?.dimensions?.length || ""} x ${parcel.parcelDetails?.dimensions?.width || ""} x ${parcel.parcelDetails?.dimensions?.height || ""} cm\nDescription: ${parcel.parcelDetails?.description || "-"}`;
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

  const handleViewDetails = () => {
    onClose();
    navigate(`/sender/parcels/${trackingId}`);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Parcel Created Successfully!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                You can download, copy, or share the parcel details below
              </p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition" onClick={onClose}>✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Tracking ID</div>
            </div>
            <div className="font-mono font-bold text-lg text-blue-900 dark:text-blue-100">{trackingId}</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">Sender</div>
            </div>
            <div className="text-sm font-medium text-purple-900 dark:text-purple-100">{senderName}</div>
            
            <div className="flex items-center gap-2 mt-3 mb-2">
              <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <div className="text-xs font-semibold text-pink-700 dark:text-pink-300">Receiver</div>
            </div>
            <div className="text-sm font-medium text-pink-900 dark:text-pink-100">{receiverName}</div>
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

          <button onClick={handleViewDetails} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow transition">
            <Eye className="w-4 h-4" />
            View Parcel Details
          </button>
        </div>
      </div>
    </div>
  );
}

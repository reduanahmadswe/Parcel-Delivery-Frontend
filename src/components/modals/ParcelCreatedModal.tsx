import React, { useState } from "react";
import { Download, Link as LinkIcon, Eye, CheckCircle2, Package, User, MapPin, Phone, Mail, Box } from "lucide-react";
import toast from "react-hot-toast";
import { generateParcelPdf } from "../../utils/parcelExport";
import { useNavigate } from "react-router-dom";

interface Props {
  parcel: any; 
  onClose: () => void;
}

export default function ParcelCreatedModal({ parcel, onClose }: Props) {
  const navigate = useNavigate();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  console.log('🎭 ParcelCreatedModal Render:', { parcel, hasParcel: !!parcel });

  if (!parcel) {
    console.log('❌ Modal: No parcel data, returning null');
    return null;
  }

  console.log('✅ Modal: Rendering with parcel:', parcel);

  const trackingId = parcel.trackingId || parcel.id || "-";

  const senderName = parcel.senderInfo?.name || parcel.senderName || parcel.sender?.name || "You";

  const receiverName = parcel.receiverInfo?.name || parcel.receiverName || "-";
  const receiverEmail = parcel.receiverInfo?.email || parcel.receiverEmail || "-";
  const receiverPhone = parcel.receiverInfo?.phone || parcel.receiverPhone || "-";

  const address = parcel.receiverInfo?.address || parcel.receiverAddress || {};
  const fullAddress = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(Boolean).join(", ") || "No address provided";

  const parcelType = parcel.parcelDetails?.type || parcel.type || "-";
  const weight = parcel.parcelDetails?.weight || parcel.weight || "-";
  const dimensions = parcel.parcelDetails?.dimensions || parcel.dimensions || {};
  const dimensionStr = dimensions.length && dimensions.width && dimensions.height 
    ? `${dimensions.length} × ${dimensions.width} × ${dimensions.height} cm`
    : "-";
  const description = parcel.parcelDetails?.description || parcel.description || "-";

  const handleGeneratePdf = async () => {
    try {
      setGeneratingPdf(true);
      await generateParcelPdf(parcel);
      toast.success("PDF generated successfully!");
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

    } catch (err) {
      toast.error("Failed to copy tracking link");
    }
  };

  const handleViewDetails = () => {
    onClose();
    
    navigate(`/track?id=${encodeURIComponent(trackingId)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl shrink-0">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Parcel Created Successfully!</h2>
                <p className="text-xs sm:text-sm text-green-50 mt-0.5 sm:mt-1">Your parcel has been registered</p>
              </div>
            </div>
            <button 
              className="text-white hover:bg-white/20 rounded-lg p-1.5 sm:p-2 transition-colors shrink-0" 
              onClick={onClose}
              aria-label="Close modal"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          {}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Tracking ID</span>
            </div>
            <div className="font-mono font-bold text-xl sm:text-2xl text-blue-900 dark:text-blue-100 break-all">
              {trackingId}
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300">Sender</h3>
              </div>
              <div className="space-y-2">
                <div className="text-base font-medium text-purple-900 dark:text-purple-100">
                  {senderName}
                </div>
              </div>
            </div>

            {}
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950/30 dark:to-rose-900/30 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <h3 className="text-sm font-bold text-pink-700 dark:text-pink-300">Receiver</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span className="text-pink-900 dark:text-pink-100 font-medium break-words">{receiverName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span className="text-pink-800 dark:text-pink-200 break-all">{receiverEmail}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span className="text-pink-800 dark:text-pink-200">{receiverPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-900/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-amber-700 dark:text-amber-300">Delivery Address</h3>
            </div>
            <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed break-words">
              {fullAddress}
            </p>
          </div>

          {}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Box className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Parcel Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Type:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">{parcelType}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Weight:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{weight} kg</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Dimensions:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{dimensionStr}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Description:</span>
                <p className="text-gray-900 dark:text-gray-100 font-medium break-words">{description}</p>
              </div>
            </div>
          </div>

          {}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={handleGeneratePdf} 
              disabled={generatingPdf} 
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">{generatingPdf ? "Generating..." : "Download PDF"}</span>
            </button>

            <button 
              onClick={handleShareTrackingLink} 
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500 transition-all text-gray-700 dark:text-gray-200"
            >
              <LinkIcon className="w-4 h-4" />
              <span className="font-medium">Copy Link</span>
            </button>

            <button 
              onClick={handleViewDetails} 
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
            >
              <Eye className="w-4 h-4" />
              <span>Track Parcel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

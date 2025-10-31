
import Modal from "../../../components/modals/ModalDialogComponent";
import StatusBadge from "../../../components/common/StatusIndicatorBadge";
import {
  Clock,
  MapPin,
  Package,
  Shield,
  Star,
  Truck,
  User,
} from "lucide-react";
import { Parcel, STATUS_OPTIONS } from "../../../services/parcelTypes";

interface ParcelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: Parcel | null;
  onUpdateStatus: (parcel: Parcel) => void;
}

export function ParcelDetailsModal({
  isOpen,
  onClose,
  parcel,
  onUpdateStatus,
}: ParcelDetailsModalProps) {
  if (!parcel) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📦 Parcel Details"
      size="xl"
    >
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {}
        <div className="group relative overflow-hidden bg-gradient-to-br from-red-50/80 via-orange-50/80 to-purple-50/80 dark:from-black/80 dark:via-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 xl:p-8 border border-red-200/30 dark:border-slate-600/20 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4 mb-0">
              <div className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 xl:space-x-4 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm sm:text-lg lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent truncate">
                    Parcel #{parcel.trackingNumber}
                  </h2>
                  <p className="text-muted-foreground text-[10px] sm:text-xs lg:text-sm xl:text-base mt-0.5 truncate">
                    Complete parcel information and real-time status
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 lg:gap-3 xl:gap-4 w-full sm:w-auto">
                <div className="group relative">
                  <StatusBadge status={parcel?.status} variant="parcel" />
                </div>
                {parcel.isUrgent && (
                  <span className="group inline-flex items-center px-2 sm:px-2.5 lg:px-3 xl:px-4 py-1 sm:py-1.5 lg:py-2 xl:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl text-[10px] sm:text-xs lg:text-sm font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-200 border border-red-300 dark:border-red-600 shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 mr-1 sm:mr-1.5 fill-current animate-pulse flex-shrink-0" />
                    Urgent Priority
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="group relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 xl:p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 mb-3 sm:mb-4 lg:mb-6 xl:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                  📋 Basic Information
                </h3>
                <p className="text-muted-foreground text-[10px] sm:text-xs lg:text-sm xl:text-base truncate">
                  Core parcel details and specifications
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
              <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs lg:text-sm font-bold text-blue-600 dark:text-blue-400">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-blue-500 rounded-full shadow-sm flex-shrink-0"></div>
                  <span className="truncate">Tracking Number</span>
                </label>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-700">
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-mono font-bold text-blue-800 dark:text-blue-200 truncate">
                    {parcel.trackingNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs lg:text-sm font-bold text-purple-600 dark:text-purple-400">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-purple-500 rounded-full shadow-sm flex-shrink-0"></div>
                  <span className="truncate">Parcel Type</span>
                </label>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl sm:rounded-2xl border border-purple-200 dark:border-purple-700">
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-purple-800 dark:text-purple-200 truncate">
                    {parcel.type}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2 space-y-1.5 sm:space-y-2 lg:space-y-3">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs lg:text-sm font-bold text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-green-500 rounded-full shadow-sm flex-shrink-0"></div>
                  <span className="truncate">Description</span>
                </label>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl sm:rounded-2xl border border-green-200 dark:border-green-700">
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-green-800 dark:text-green-200 break-words">
                    {parcel.description}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs lg:text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-yellow-500 rounded-full shadow-sm flex-shrink-0"></div>
                  <span className="truncate">Weight</span>
                </label>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl sm:rounded-2xl border border-yellow-200 dark:border-yellow-700">
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-yellow-800 dark:text-yellow-200 truncate">
                    {parcel.weight} kg
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs lg:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-emerald-500 rounded-full shadow-sm flex-shrink-0"></div>
                  <span className="truncate">Delivery Cost</span>
                </label>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl sm:rounded-2xl border border-emerald-200 dark:border-emerald-700">
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-emerald-800 dark:text-emerald-200 truncate">
                    ${parcel.cost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          {}
          <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 xl:p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
            <div className="relative">
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 mb-3 sm:mb-4 lg:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg xl:text-2xl font-bold text-foreground truncate">
                    👤 Sender Details
                  </h3>
                  <p className="text-muted-foreground text-[10px] sm:text-xs lg:text-sm truncate">
                    Package origin information
                  </p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl sm:rounded-2xl border border-green-200 dark:border-green-700">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-1.5 lg:mb-2">
                    Full Name
                  </label>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-green-800 dark:text-green-200 truncate">
                    {parcel.senderName}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-700">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-1.5 lg:mb-2">
                    Email Address
                  </label>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-mono text-blue-800 dark:text-blue-200 truncate">
                    {parcel.senderEmail}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl sm:rounded-2xl border border-purple-200 dark:border-purple-700">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-1.5 lg:mb-2">
                    Phone Number
                  </label>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-mono text-purple-800 dark:text-purple-200 truncate">
                    {parcel.senderPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 xl:p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5"></div>
            <div className="relative">
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 mb-3 sm:mb-4 lg:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg xl:text-2xl font-bold text-foreground truncate">
                    📍 Recipient Details
                  </h3>
                  <p className="text-muted-foreground text-[10px] sm:text-xs lg:text-sm truncate">
                    Package destination information
                  </p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl sm:rounded-2xl border border-purple-200 dark:border-purple-700">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-1.5 lg:mb-2">
                    Full Name
                  </label>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-purple-800 dark:text-purple-200 truncate">
                    {parcel.recipientName}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl sm:rounded-2xl border border-indigo-200 dark:border-indigo-700">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1 sm:mb-1.5 lg:mb-2">
                    Email Address
                  </label>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-mono text-indigo-800 dark:text-indigo-200 truncate">
                    {parcel.recipientEmail}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl sm:rounded-2xl border border-pink-200 dark:border-pink-700">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-bold text-pink-600 dark:text-pink-400 mb-1 sm:mb-1.5 lg:mb-2">
                    Phone Number
                  </label>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-mono text-pink-800 dark:text-pink-200 truncate">
                    {parcel.recipientPhone}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl sm:rounded-2xl border border-orange-200 dark:border-orange-700">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-bold text-orange-600 dark:text-orange-400 mb-1 sm:mb-1.5 lg:mb-2">
                    Delivery Address
                  </label>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-orange-800 dark:text-orange-200 leading-relaxed break-words">
                    {parcel.recipientAddress.street}
                    <br />
                    {parcel.recipientAddress.city},{" "}
                    {parcel.recipientAddress.state}{" "}
                    {parcel.recipientAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 xl:p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 mb-3 sm:mb-4 lg:mb-6 xl:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base lg:text-lg xl:text-2xl font-bold text-foreground truncate">
                  🚚 Delivery Information
                </h3>
                <p className="text-muted-foreground text-[10px] sm:text-xs lg:text-sm truncate">
                  Additional parcel specifications
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
              <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl sm:rounded-2xl border border-orange-200 dark:border-orange-700">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs lg:text-sm font-bold text-orange-600 dark:text-orange-400 mb-1.5 sm:mb-2 lg:mb-3">
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Delivery Type</span>
                </label>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-orange-800 dark:text-orange-200 truncate">
                  {parcel.deliveryType}
                </p>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl sm:rounded-2xl border border-green-200 dark:border-green-700">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs lg:text-sm font-bold text-green-600 dark:text-green-400 mb-1.5 sm:mb-2 lg:mb-3">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Insurance Status</span>
                </label>
                <span
                  className={`inline-flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 px-2 sm:px-2.5 lg:px-3 xl:px-4 py-1 sm:py-1.5 lg:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs lg:text-sm font-bold whitespace-nowrap ${
                    parcel.isInsured
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-200"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-700/50 dark:to-gray-600/50 dark:text-gray-200"
                  }`}
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{parcel.isInsured ? "Insured" : "Not Insured"}</span>
                </span>
              </div>
              <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-700">
                <label className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs lg:text-sm font-bold text-blue-600 dark:text-blue-400 mb-1.5 sm:mb-2 lg:mb-3">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Created Date</span>
                </label>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-blue-800 dark:text-blue-200 truncate">
                  {new Date(parcel.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-1 truncate">
                  {new Date(parcel.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-col xs:flex-row justify-end gap-2 sm:gap-3 lg:gap-4 xl:gap-6 pt-3 sm:pt-4 lg:pt-6 xl:pt-8 border-t border-border">
          <button
            onClick={onClose}
            className="w-full xs:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-muted-foreground hover:text-foreground font-semibold transition-colors duration-300 hover:scale-105 transform text-xs sm:text-sm lg:text-base"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onUpdateStatus(parcel);
            }}
            className="group flex items-center justify-center space-x-2 sm:space-x-2.5 lg:space-x-3 w-full xs:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl sm:rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base"
          >
            <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
            <span>Update Status</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: Parcel | null;
  newStatus: string;
  setNewStatus: (status: string) => void;
  onUpdate: () => void;
  loading: boolean;
}

export function StatusUpdateModal({
  isOpen,
  onClose,
  parcel,
  newStatus,
  setNewStatus,
  onUpdate,
  loading,
}: StatusUpdateModalProps) {
  if (!parcel) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🔄 Update Parcel Status"
      size="md"
    >
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 xl:space-y-8">
        {}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-purple-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-purple-900/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 xl:p-6 border border-red-200/30 dark:border-red-700/20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
          <div className="relative text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-2 sm:mb-3 lg:mb-4">
              <Package className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-1.5 lg:mb-2">
              Status Update
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base truncate px-2">
              Parcel #{parcel.trackingNumber}
            </p>
          </div>
        </div>

        {}
        <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-slate-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 mb-2 sm:mb-3 lg:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <label className="text-sm sm:text-base lg:text-lg font-bold text-foreground">
                Current Status
              </label>
            </div>
            <div className="p-2 sm:p-2.5 lg:p-3 xl:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
              <StatusBadge status={parcel?.status} variant="parcel" />
            </div>
          </div>
        </div>

        {}
        <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 mb-2 sm:mb-3 lg:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <label className="text-sm sm:text-base lg:text-lg font-bold text-foreground">
                Select New Status
              </label>
            </div>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-2 sm:py-2.5 lg:py-3 xl:py-4 bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] transition-all duration-300 hover:shadow-lg cursor-pointer text-xs sm:text-sm lg:text-base xl:text-lg font-semibold"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {}
        <div className="flex flex-col xs:flex-row justify-end gap-2 sm:gap-3 lg:gap-4 xl:gap-6 pt-3 sm:pt-4 lg:pt-5 xl:pt-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full xs:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 xl:py-4 text-muted-foreground hover:text-foreground font-semibold transition-colors duration-300 hover:scale-105 transform text-xs sm:text-sm lg:text-base"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            disabled={loading}
            className="group flex items-center justify-center space-x-2 sm:space-x-2.5 lg:space-x-3 w-full xs:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 xl:py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl sm:rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none text-xs sm:text-sm lg:text-base"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                <span>Update Status</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}


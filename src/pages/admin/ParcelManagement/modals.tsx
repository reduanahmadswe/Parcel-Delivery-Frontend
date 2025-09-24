// Modal components for Parcel Management
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
import { Parcel, STATUS_OPTIONS } from "../../../shared/services/parcelTypes";

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
      <div className="space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-purple-50 dark:from-black dark:via-slate-900 dark:to-slate-800 rounded-3xl p-8 border border-red-200/30 dark:border-slate-600/20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                    Parcel #{parcel.trackingNumber}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Complete parcel information and status
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status={parcel?.status} variant="parcel" />
                {parcel.isUrgent && (
                  <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-200 border border-red-300 dark:border-red-600 shadow-lg">
                    <Star className="w-4 h-4 mr-2 fill-current animate-pulse" />
                    Urgent Priority
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modern Basic Information Card */}
        <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  📋 Basic Information
                </h3>
                <p className="text-muted-foreground">
                  Core parcel details and specifications
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                  <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                  <span>Tracking Number</span>
                </label>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <p className="text-xl font-mono font-bold text-blue-800 dark:text-blue-200">
                    {parcel.trackingNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-bold text-purple-600 dark:text-purple-400">
                  <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                  <span>Parcel Type</span>
                </label>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl border border-purple-200 dark:border-purple-700">
                  <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
                    {parcel.type}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center space-x-2 text-sm font-bold text-green-600 dark:text-green-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  <span>Description</span>
                </label>
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl border border-green-200 dark:border-green-700">
                  <p className="text-lg text-green-800 dark:text-green-200">
                    {parcel.description}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                  <span>Weight</span>
                </label>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-2xl border border-yellow-200 dark:border-yellow-700">
                  <p className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                    {parcel.weight} kg
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                  <span>Delivery Cost</span>
                </label>
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                  <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                    ${parcel.cost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Sender & Recipient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Enhanced Sender Card */}
          <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    👤 Sender Details
                  </h3>
                  <p className="text-muted-foreground">
                    Package origin information
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl border border-green-200 dark:border-green-700">
                  <label className="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                    Full Name
                  </label>
                  <p className="text-lg font-bold text-green-800 dark:text-green-200">
                    {parcel.senderName}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <label className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                    Email Address
                  </label>
                  <p className="text-lg font-mono text-blue-800 dark:text-blue-200">
                    {parcel.senderEmail}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl border border-purple-200 dark:border-purple-700">
                  <label className="block text-sm font-bold text-purple-600 dark:text-purple-400 mb-2">
                    Phone Number
                  </label>
                  <p className="text-lg font-mono text-purple-800 dark:text-purple-200">
                    {parcel.senderPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Recipient Card */}
          <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    📍 Recipient Details
                  </h3>
                  <p className="text-muted-foreground">
                    Package destination information
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl border border-purple-200 dark:border-purple-700">
                  <label className="block text-sm font-bold text-purple-600 dark:text-purple-400 mb-2">
                    Full Name
                  </label>
                  <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                    {parcel.recipientName}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                  <label className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    Email Address
                  </label>
                  <p className="text-lg font-mono text-indigo-800 dark:text-indigo-200">
                    {parcel.recipientEmail}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-2xl border border-pink-200 dark:border-pink-700">
                  <label className="block text-sm font-bold text-pink-600 dark:text-pink-400 mb-2">
                    Phone Number
                  </label>
                  <p className="text-lg font-mono text-pink-800 dark:text-pink-200">
                    {parcel.recipientPhone}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl border border-orange-200 dark:border-orange-700">
                  <label className="block text-sm font-bold text-orange-600 dark:text-orange-400 mb-2">
                    Delivery Address
                  </label>
                  <p className="text-lg text-orange-800 dark:text-orange-200 leading-relaxed">
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

        {/* Enhanced Additional Information */}
        <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  🚚 Delivery Information
                </h3>
                <p className="text-muted-foreground">
                  Additional parcel specifications
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl border border-orange-200 dark:border-orange-700">
                <label className="flex items-center space-x-2 text-sm font-bold text-orange-600 dark:text-orange-400 mb-3">
                  <Truck className="w-4 h-4" />
                  <span>Delivery Type</span>
                </label>
                <p className="text-lg font-bold text-orange-800 dark:text-orange-200">
                  {parcel.deliveryType}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl border border-green-200 dark:border-green-700">
                <label className="flex items-center space-x-2 text-sm font-bold text-green-600 dark:text-green-400 mb-3">
                  <Shield className="w-4 h-4" />
                  <span>Insurance Status</span>
                </label>
                <span
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-bold ${
                    parcel.isInsured
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-200"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-700/50 dark:to-gray-600/50 dark:text-gray-200"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>{parcel.isInsured ? "Insured" : "Not Insured"}</span>
                </span>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>Created Date</span>
                </label>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {new Date(parcel.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {new Date(parcel.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex justify-end space-x-6 pt-8 border-t border-border">
          <button
            onClick={onClose}
            className="px-8 py-4 text-muted-foreground hover:text-foreground font-semibold transition-colors duration-300 hover:scale-105 transform"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onUpdateStatus(parcel);
            }}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Package className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
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
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-purple-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-red-200/30 dark:border-red-700/20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
          <div className="relative text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
              Status Update
            </h2>
            <p className="text-muted-foreground">
              Parcel #{parcel.trackingNumber}
            </p>
          </div>
        </div>

        {/* Current Status Card */}
        <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-slate-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <label className="text-lg font-bold text-foreground">
                Current Status
              </label>
            </div>
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
              <StatusBadge status={parcel?.status} variant="parcel" />
            </div>
          </div>
        </div>

        {/* New Status Selection */}
        <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <label className="text-lg font-bold text-foreground">
                Select New Status
              </label>
            </div>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-6 py-4 bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] transition-all duration-300 hover:shadow-lg cursor-pointer text-lg font-semibold"
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

        {/* Enhanced Action Buttons */}
        <div className="flex justify-end space-x-6 pt-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-8 py-4 text-muted-foreground hover:text-foreground font-semibold transition-colors duration-300 hover:scale-105 transform"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            disabled={loading}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Package className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Update Status</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}


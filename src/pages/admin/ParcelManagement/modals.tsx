// Modal components for Parcel Management
import Modal from "@/pages/admin/ModalDialogComponent";
import StatusBadge from "@/pages/admin/StatusIndicatorBadge";
import { Parcel, STATUS_OPTIONS } from "./types";

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
    <Modal isOpen={isOpen} onClose={onClose} title="Parcel Details" size="xl">
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Tracking Number
              </label>
              <p className="text-foreground font-mono">
                {parcel.trackingNumber}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Type
              </label>
              <p className="text-foreground">{parcel.type}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </label>
              <p className="text-slate-900 dark:text-slate-100">
                {parcel.description}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Weight
              </label>
              <p className="text-slate-900 dark:text-slate-100">
                {parcel.weight} kg
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Cost
              </label>
              <p className="text-slate-900 dark:text-slate-100">
                ${parcel.cost}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <StatusBadge status={parcel?.status} variant="parcel" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </label>
              {parcel.isUrgent ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Urgent
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  Normal
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sender & Recipient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Sender Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {parcel.senderName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {parcel.senderEmail}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {parcel.senderPhone}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Recipient Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {parcel.recipientName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {parcel.recipientEmail}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {parcel.recipientPhone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Address
                </label>
                <p className="text-slate-900 dark:text-slate-100">
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

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Delivery Type
              </label>
              <p className="text-slate-900 dark:text-slate-100">
                {parcel.deliveryType}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Insured
              </label>
              <p className="text-slate-900 dark:text-slate-100">
                {parcel.isInsured ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Created
              </label>
              <p className="text-slate-900 dark:text-slate-100">
                {new Date(parcel.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onUpdateStatus(parcel);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Status
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
      title="Update Parcel Status"
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Current Status
          </label>
          <StatusBadge status={parcel?.status} variant="parcel" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            New Status
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
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

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            disabled={loading || newStatus === parcel?.status}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

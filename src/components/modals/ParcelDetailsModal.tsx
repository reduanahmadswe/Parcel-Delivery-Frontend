"use client";
import { formatDate, getStatusColor } from "../../utils/HelperUtilities";
import { Parcel } from "../../types/GlobalTypeDefinitions";
import {
  Calendar,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Package,
  Phone,
  Ruler,
  Truck,
  User,
  Weight,
  X,
} from "lucide-react";

interface ParcelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: Parcel | null;
}

export default function ParcelDetailsModal({
  isOpen,
  onClose,
  parcel,
}: ParcelDetailsModalProps) {
  if (!isOpen || !parcel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Parcel Details
            </h2>
            <p className="text-muted-foreground">
              Tracking ID: {parcel.trackingId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Current Status
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  parcel.currentStatus
                )}`}
              >
                {parcel.currentStatus.replace("-", " ").toUpperCase()}
              </span>
            </div>
            {parcel.deliveryInfo?.preferredDeliveryDate && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Preferred Delivery:{" "}
                  {formatDate(parcel.deliveryInfo.preferredDeliveryDate)}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Sender Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {parcel.senderInfo.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {parcel.senderInfo.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {parcel.senderInfo.phone}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="text-muted-foreground">
                    <div>{parcel.senderInfo.address.street}</div>
                    <div>
                      {parcel.senderInfo.address.city},{" "}
                      {parcel.senderInfo.address.state}{" "}
                      {parcel.senderInfo.address.zipCode}
                    </div>
                    <div>{parcel.senderInfo.address.country}</div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Receiver Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {parcel.receiverInfo.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {parcel.receiverInfo.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {parcel.receiverInfo.phone}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="text-muted-foreground">
                    <div>{parcel.receiverInfo.address.street}</div>
                    <div>
                      {parcel.receiverInfo.address.city},{" "}
                      {parcel.receiverInfo.address.state}{" "}
                      {parcel.receiverInfo.address.zipCode}
                    </div>
                    <div>{parcel.receiverInfo.address.country}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Package className="h-5 w-5 mr-2 text-purple-600" />
              Parcel Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground font-medium">
                    {parcel.parcelDetails.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="text-foreground font-medium">
                    {parcel.parcelDetails.weight} kg
                  </span>
                </div>
                {parcel.parcelDetails.value && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Value:</span>
                    <span className="text-foreground font-medium">
                      ৳{parcel.parcelDetails.value}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {parcel.parcelDetails.dimensions && (
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="text-foreground font-medium">
                      {parcel.parcelDetails.dimensions.length} ×{" "}
                      {parcel.parcelDetails.dimensions.width} ×{" "}
                      {parcel.parcelDetails.dimensions.height} cm
                    </span>
                  </div>
                )}
                {parcel.parcelDetails.description && (
                  <div className="flex items-start space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <span className="text-muted-foreground">
                        Description:
                      </span>
                      <p className="text-foreground">
                        {parcel.parcelDetails.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {}
          <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-orange-600" />
              Delivery Information
            </h3>
            <div className="space-y-2">
              {parcel.deliveryInfo.preferredDeliveryDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Preferred Delivery Date:
                  </span>
                  <span className="text-foreground font-medium">
                    {formatDate(parcel.deliveryInfo.preferredDeliveryDate)}
                  </span>
                </div>
              )}
              {parcel.deliveryInfo.isUrgent && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">
                    Urgent Delivery
                  </span>
                </div>
              )}
              {parcel.deliveryInfo.deliveryInstructions && (
                <div className="flex items-start space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="text-muted-foreground">
                      Delivery Instructions:
                    </span>
                    <p className="text-foreground">
                      {parcel.deliveryInfo.deliveryInstructions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {}
          {parcel.fee && (
            <div className="bg-yellow-50/50 dark:bg-yellow-950/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-yellow-600" />
                Fee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivery Fee:</span>
                    <span className="text-foreground font-medium">
                      ৳{parcel.fee.totalFee || 0}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-foreground font-semibold">
                      Total Fee:
                    </span>
                    <span className="text-foreground font-bold text-lg">
                      ৳{parcel.fee.totalFee || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground font-medium">
                  {formatDate(parcel.createdAt)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-foreground font-medium">
                  {formatDate(parcel.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              window.open(`/track?id=${parcel.trackingId}`, "_blank");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Track Parcel
          </button>
        </div>
      </div>
    </div>
  );
}


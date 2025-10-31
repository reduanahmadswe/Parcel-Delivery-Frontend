
import { ApiParcel, Parcel } from "../../../services/parcelTypes";

export class ParcelDataTransformer {
  
  static transformApiParcelToParcel(parcel: ApiParcel, index: number): Parcel {
    
    const parcelId = parcel.id || parcel._id || 0;

    const processedParcel: Parcel = {
      id: parcelId,
      trackingNumber:
        parcel.trackingId ||
        parcel.trackingNumber ||
        parcel.tracking_number ||
        `TRK${parcelId.toString().padStart(6, "0")}`,
      type:
        parcel.parcelDetails?.type ||
        parcel.type ||
        parcel.parcelType ||
        "Standard",
      description:
        parcel.parcelDetails?.description ||
        parcel.description ||
        "Package",
      weight:
        parcel.parcelDetails?.weight ||
        parcel.weight ||
        parcel.weightInKg ||
        1.0,
      dimensions: {
        length:
          parcel.parcelDetails?.dimensions?.length ||
          parcel.dimensions?.length ||
          parcel.length ||
          10,
        width:
          parcel.parcelDetails?.dimensions?.width ||
          parcel.dimensions?.width ||
          parcel.width ||
          10,
        height:
          parcel.parcelDetails?.dimensions?.height ||
          parcel.dimensions?.height ||
          parcel.height ||
          10,
      },
      status: (parcel.currentStatus ||
        parcel.status ||
        "requested") as
        | "requested"
        | "approved"
        | "dispatched"
        | "in-transit"
        | "delivered"
        | "cancelled"
        | "returned",
      senderName:
        parcel.senderInfo?.name ||
        parcel.senderName ||
        parcel.sender?.name ||
        parcel.sender_name ||
        "Unknown Sender",
      senderEmail:
        parcel.senderInfo?.email ||
        parcel.senderEmail ||
        parcel.sender?.email ||
        parcel.sender_email ||
        "sender@example.com",
      senderPhone:
        parcel.senderInfo?.phone ||
        parcel.senderPhone ||
        parcel.sender?.phone ||
        parcel.sender_phone ||
        "+8801700000000",
      recipientName:
        parcel.receiverInfo?.name ||
        parcel.recipientName ||
        parcel.recipient?.name ||
        parcel.receiver?.name ||
        parcel.recipient_name ||
        parcel.receiver_name ||
        "Unknown Recipient",
      recipientEmail:
        parcel.receiverInfo?.email ||
        parcel.recipientEmail ||
        parcel.recipient?.email ||
        parcel.receiver?.email ||
        parcel.recipient_email ||
        parcel.receiver_email ||
        "recipient@example.com",
      recipientPhone:
        parcel.receiverInfo?.phone ||
        parcel.recipientPhone ||
        parcel.recipient?.phone ||
        parcel.receiver?.phone ||
        parcel.recipient_phone ||
        parcel.receiver_phone ||
        "+8801800000000",
      recipientAddress: {
        street:
          parcel.receiverInfo?.address?.street ||
          parcel.recipientAddress?.street ||
          parcel.recipient?.address?.street ||
          parcel.deliveryAddress?.street ||
          "Street Address",
        city:
          parcel.receiverInfo?.address?.city ||
          parcel.recipientAddress?.city ||
          parcel.recipient?.address?.city ||
          parcel.deliveryAddress?.city ||
          "Dhaka",
        state:
          parcel.receiverInfo?.address?.state ||
          parcel.recipientAddress?.state ||
          parcel.recipient?.address?.state ||
          parcel.deliveryAddress?.state ||
          "Dhaka Division",
        zipCode:
          parcel.receiverInfo?.address?.zipCode ||
          parcel.recipientAddress?.zipCode ||
          parcel.recipient?.address?.zipCode ||
          parcel.deliveryAddress?.zipCode ||
          "1000",
      },
      cost:
        parcel.fee?.totalFee ||
        parcel.cost ||
        parcel.price ||
        parcel.amount ||
        100,
      deliveryType:
        parcel.deliveryType || parcel.delivery_type || "Standard",
      isInsured: parcel.isInsured || parcel.is_insured || false,
      isUrgent:
        parcel.deliveryInfo?.isUrgent ||
        parcel.isUrgent ||
        parcel.is_urgent ||
        parcel.priority === "urgent" ||
        false,
      isFlagged: parcel.isFlagged || parcel.is_flagged || false,
      isOnHold:
        parcel.isHeld ||
        parcel.isOnHold ||
        parcel.is_on_hold ||
        false,
      assignedPersonnel:
        parcel.assignedDeliveryPersonnel ||
        parcel.assignedPersonnel ||
        parcel.assigned_personnel ||
        parcel.assignedTo ||
        "",
      createdAt:
        typeof parcel.createdAt === "string"
          ? parcel.createdAt
          : parcel.createdAt?.$date || new Date().toISOString(),
      updatedAt:
        typeof parcel.updatedAt === "string"
          ? parcel.updatedAt
          : parcel.updatedAt?.$date || new Date().toISOString(),
    };

    return processedParcel;
  }

  static transformApiParcelsToFrontend(apiParcels: ApiParcel[]): Parcel[] {
    if (!Array.isArray(apiParcels) || apiParcels.length === 0) {
      return [];
    }

    return apiParcels.map((parcel, index) =>
      this.transformApiParcelToParcel(parcel, index)
    );
  }

  static filterParcels(parcels: Parcel[], searchTerm: string): Parcel[] {
    if (!searchTerm.trim()) {
      return parcels;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return parcels.filter((parcel) => {
      
      const searchableFields = [
        parcel.trackingNumber,
        parcel.senderName,
        parcel.senderEmail,
        parcel.recipientName,
        parcel.recipientEmail,
        parcel.status,
        parcel.description,
        parcel.type,
      ];

      return searchableFields.some((field) =>
        field?.toLowerCase().includes(searchLower)
      );
    });
  }

  static filterParcelsByParams(parcels: Parcel[], filterParams: import("../../../services/parcelTypes").FilterParams): Parcel[] {
    return parcels.filter((parcel) => {
      
      if (filterParams.trackingNumber && filterParams.trackingNumber.trim()) {
        const trackingLower = filterParams.trackingNumber.toLowerCase().trim();
        if (!parcel.trackingNumber?.toLowerCase().includes(trackingLower)) {
          return false;
        }
      }

      if (filterParams.senderEmail && filterParams.senderEmail.trim()) {
        const senderEmailLower = filterParams.senderEmail.toLowerCase().trim();
        if (!parcel.senderEmail?.toLowerCase().includes(senderEmailLower)) {
          return false;
        }
      }

      if (filterParams.receiverEmail && filterParams.receiverEmail.trim()) {
        const receiverEmailLower = filterParams.receiverEmail.toLowerCase().trim();
        if (!parcel.recipientEmail?.toLowerCase().includes(receiverEmailLower)) {
          return false;
        }
      }

      if (filterParams.status && filterParams.status.trim()) {
        if (parcel.status !== filterParams.status) {
          return false;
        }
      }

      return true;
    });
  }
}


export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'sender' | 'receiver';
  address: Address;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PersonInfo {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface ParcelDetails {
  type: 'document' | 'package' | 'fragile' | 'electronics' | 'clothing' | 'other';
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
  value: number;
}

export interface DeliveryInfo {
  preferredDeliveryDate: string;
  deliveryInstructions: string;
  isUrgent: boolean;
}

export interface StatusLog {
  status: ParcelStatus;
  timestamp: string;
  updatedBy: string;
  updatedByType?: 'admin' | 'sender' | 'receiver';
  location?: string;
  note?: string;
}

export interface Fee {
  baseFee: number;
  weightFee: number;
  urgentFee: number;
  totalFee: number;
  isPaid: boolean;
  paymentMethod?: string;
}

export type ParcelStatus = 'requested' | 'approved' | 'dispatched' | 'in-transit' | 'delivered' | 'cancelled' | 'returned';

export interface Parcel {
  _id: string;
  trackingId: string;
  senderId: string;
  receiverId?: string;
  senderInfo: PersonInfo;
  receiverInfo: PersonInfo;
  parcelDetails: ParcelDetails;
  deliveryInfo: DeliveryInfo;
  currentStatus: ParcelStatus;
  statusHistory: StatusLog[];
  fee: Fee;
  assignedDeliveryPersonnel?: string;
  isFlagged: boolean;
  isHeld: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
    success: boolean
    data: {
        user: User
        token: string
        refreshToken?: string
    }
    message: string
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  senderUsers: number;
  receiverUsers: number;
  blockedUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}

export interface ParcelStats {
  totalParcels: number;
  requested: number;
  approved: number;
  dispatched: number;
  inTransit: number;
  delivered: number;
  cancelled: number;
  returned: number;
  urgentParcels: number;
  blockedParcels: number;
  flaggedParcels: number;
  heldParcels: number;
  totalRevenue: number;
  paidParcels: number;
  unpaidParcels: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalParcels: number;
  activeParcels: number;
  issuesAndAlerts: {
    blockedParcels: number;
    heldParcels: number;
    flaggedParcels: number;
    blockedUsers: number;
    total: number;
  };
  parcelStatusCounts: {
    pending: number;      
    inTransit: number;    
    delivered: number;
    cancelled: number;
    returned: number;
  };
  recentActivity: {
    newParcels: number;
    completedToday: number;
    urgentParcels: number;
  };
  revenue: {
    total: number;
    today: number;
    thisMonth: number;
    paid: number;
    unpaid: number;
  };
  userBreakdown: {
    admins: number;
    senders: number;
    receivers: number;
    blockedUsers: number;
    verifiedUsers: number;
  };
}


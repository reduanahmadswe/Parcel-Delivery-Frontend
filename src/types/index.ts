
export * from './GlobalTypeDefinitions'

export interface User {
    _id: string
    name: string
    email: string
    role: 'admin' | 'sender' | 'receiver'
    phone?: string
    address?: Address
    createdAt: string
    updatedAt: string
}

export interface Address {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
    role: 'sender' | 'receiver'
    phone?: string
    address?: Address
}

export interface AuthResponse {
    success: boolean
    data: {
        user: User
        token: string
    }
    message: string
}

export interface Parcel {
    _id: string
    trackingId: string
    senderId: string
    senderInfo: {
        name: string
        email: string
        phone: string
        address: Address
    }
    receiverInfo: {
        name: string
        email: string
        phone: string
        address: Address
    }
    parcelDetails: {
        type: 'document' | 'package' | 'fragile' | 'electronics' | 'clothing' | 'other'
        weight: number
        dimensions: {
            length: number
            width: number
            height: number
        }
        description: string
        value: number
    }
    deliveryInfo: {
        preferredDeliveryDate: string
        deliveryInstructions: string
        isUrgent: boolean
    }
    status: 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'cancelled'
    statusHistory: StatusUpdate[]
    paymentInfo: {
        amount: number
        status: 'pending' | 'paid' | 'failed'
        method?: string
    }
    createdAt: string
    updatedAt: string
}

export interface StatusUpdate {
    status: Parcel['status']
    timestamp: string
    location?: string
    note?: string
}

export interface CreateParcelData {
    receiverName: string
    receiverEmail: string
    receiverPhone: string
    receiverAddress: Address
    parcelDetails: Parcel['parcelDetails']
    deliveryInfo: Parcel['deliveryInfo']
}

export interface ApiResponse<T = unknown> {
    success: boolean
    data: T
    message: string
}

export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    pagination: {
        total: number
        page: number
        limit: number
        pages: number
    }
    message: string
}

export interface ApiError {
    success: false
    message: string
    errors?: Array<{
        field: string
        message: string
    }>
}

export interface ParcelFilters {
    status?: Parcel['status']
    search?: string
    startDate?: string
    endDate?: string
}

export interface SortOptions {
    field: string
    order: 'asc' | 'desc'
}

export interface DashboardStats {
    totalParcels: number
    pendingParcels: number
    inTransitParcels: number
    deliveredParcels: number
    totalRevenue: number
    recentParcels: Parcel[]
}

export interface SystemAlert {
    id: string
    type: 'warning' | 'error' | 'info' | 'success'
    title: string
    message: string
    timestamp: string
    isRead: boolean
    priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface ChartData {
    name: string
    value: number
    [key: string]: string | number
}

export type Theme = 'light' | 'dark' | 'system'

export interface RouteConfig {
    path: string
    element: React.ComponentType<Record<string, never>>
    protected?: boolean
    allowedRoles?: User['role'][]
    exact?: boolean
}


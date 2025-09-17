// Helper function to calculate relative time
export const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

// Helper function to format numbers
export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
};

// Helper function to calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

// Helper function to get status color
export const getStatusColor = (status: string): string => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case "pending":
            return "yellow";
        case "in-transit":
        case "shipped":
        case "on_the_way":
        case "in transit":
        case "out-for-delivery":
            return "blue";
        case "delivered":
            return "green";
        case "cancelled":
        case "failed":
            return "red";
        default:
            return "gray";
    }
};

// Helper function to generate tracking number
export const generateTrackingNumber = (parcel: any): string => {
    return (
        parcel.trackingId ||
        parcel.trackingNumber ||
        parcel.tracking_number ||
        parcel._id ||
        `PKG-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    );
};
interface StatusBadgeProps {
  status: string;
  variant?: "parcel" | "user" | "custom";
  className?: string;
}

export default function StatusBadge({
  status,
  variant = "parcel",
  className = "",
}: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (variant === "parcel") {
      switch (status.toLowerCase()) {
        case "pending":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "in_transit":
        case "in-transit":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "delivered":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "cancelled":
        case "canceled":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "returned":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        case "held":
        case "on_hold":
          return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      }
    }

    if (variant === "user") {
      switch (status.toLowerCase()) {
        case "active":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "blocked":
        case "suspended":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "pending":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      }
    }

    // Custom variant - default styling
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig()} ${className}`}
    >
      {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  );
}

interface StatusBadgeProps {
  status: string | null | undefined;
  variant?: "parcel" | "user" | "custom";
  className?: string;
}

export default function StatusBadge({
  status,
  variant = "parcel",
  className = "",
}: StatusBadgeProps) {
  
  const safeStatus = status?.toString() || "unknown";

  const getStatusConfig = () => {
    if (variant === "parcel") {
      switch (safeStatus.toLowerCase()) {
        case "pending":
        case "requested":
          return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-200 border border-orange-300 dark:border-orange-600 shadow-sm";
        case "in_transit":
        case "in-transit":
        case "dispatched":
          return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-200 border border-blue-300 dark:border-blue-600 shadow-sm";
        case "delivered":
          return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-200 border border-green-300 dark:border-green-600 shadow-sm";
        case "cancelled":
        case "canceled":
          return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-200 border border-red-300 dark:border-red-600 shadow-sm";
        case "returned":
          return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 dark:from-purple-900/50 dark:to-purple-800/50 dark:text-purple-200 border border-purple-300 dark:border-purple-600 shadow-sm";
        case "held":
        case "on_hold":
          return "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 dark:from-orange-900/50 dark:to-red-900/50 dark:text-orange-200 border border-orange-300 dark:border-red-600 shadow-sm";
        default:
          return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 dark:from-slate-700/50 dark:to-slate-600/50 dark:text-slate-200 border border-slate-300 dark:border-slate-600";
      }
    }

    if (variant === "user") {
      switch (safeStatus.toLowerCase()) {
        case "active":
          return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-200 border border-green-300 dark:border-green-600 shadow-sm";
        case "blocked":
        case "suspended":
          return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-200 border border-red-300 dark:border-red-600 shadow-sm";
        case "pending":
          return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-200 border border-orange-300 dark:border-orange-600 shadow-sm";
        default:
          return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 dark:from-slate-700/50 dark:to-slate-600/50 dark:text-slate-200 border border-slate-300 dark:border-slate-600";
      }
    }

    switch (safeStatus.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-200 border border-green-300 dark:border-green-600 shadow-sm";
      case "blocked":
      case "suspended":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-200 border border-red-300 dark:border-red-600 shadow-sm";
      case "pending":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-200 border border-orange-300 dark:border-orange-600 shadow-sm";
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 dark:from-slate-700/50 dark:to-slate-600/50 dark:text-slate-200 border border-slate-300 dark:border-slate-600";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${getStatusConfig()} ${className}`}
    >
      {safeStatus.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  );
}


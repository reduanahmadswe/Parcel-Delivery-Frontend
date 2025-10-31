"use client";

import {
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Search,
  User,
} from "lucide-react";
import React from "react";

interface ReceiverNavigationProps {
  className?: string;
}

const ReceiverNavigation: React.FC<ReceiverNavigationProps> = ({
  className,
}) => {
  const navigationItems = [
    {
      id: "profile",
      label: "Profile Settings",
      description: "Update your personal information",
      icon: User,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
      route: "/receiver/profile",
      external: false,
    },
    {
      id: "track",
      label: "Track Parcel",
      description: "Track any parcel with tracking ID",
      icon: Search,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      hoverBg: "hover:bg-green-100 dark:hover:bg-green-900/30",
      route: "/receiver/track",
      external: false,
    },
    {
      id: "status-history",
      label: "Status History",
      description: "View complete delivery timeline",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      hoverBg: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      route: "/receiver/history",
      external: false,
    },
  ];

  const handleNavigation = (route: string, external: boolean) => {
    if (external) {
      window.open(route, "_blank");
    } else {
      window.location.href = route;
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}
    >
      <div className="p-6">
        {}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access receiver features and settings
            </p>
          </div>
        </div>

        {}
        <div className="space-y-3">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.route, item.external)}
                className={`w-full flex items-center justify-between p-4 ${item.bgColor} border ${item.borderColor} rounded-lg ${item.hoverBg} transition-all duration-200 group`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 bg-gradient-to-r ${item.color} rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {item.external && (
                    <ExternalLink className={`h-4 w-4 ${item.textColor}`} />
                  )}
                  <ChevronRight
                    className={`h-4 w-4 ${item.textColor} group-hover:translate-x-1 transition-transform duration-200`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              All Systems Operational
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Receiver dashboard is fully functional. All features are available
            for use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiverNavigation;


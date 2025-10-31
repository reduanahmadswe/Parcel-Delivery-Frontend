"use client";

import AdminLayout from "@/pages/admin/AdminDashboardLayout";
import { AlertTriangle, Bell, CheckCircle, Clock } from "lucide-react";

export default function AdminNotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "New parcel registered",
      description: "TRK001234 has been added to the system by Ahmed Hassan",
      time: "2 minutes ago",
      type: "info",
      unread: true,
    },
    {
      id: 2,
      title: "User registration",
      description: "New user Ahmed Hassan registered as sender",
      time: "15 minutes ago",
      type: "success",
      unread: true,
    },
    {
      id: 3,
      title: "Parcel delivered",
      description: "TRK005678 successfully delivered to Rashida Begum",
      time: "1 hour ago",
      type: "success",
      unread: false,
    },
    {
      id: 4,
      title: "Flagged parcel requires attention",
      description: "TRK009876 has been flagged for review",
      time: "2 hours ago",
      type: "warning",
      unread: false,
    },
    {
      id: 5,
      title: "System maintenance completed",
      description: "Database backup and optimization completed successfully",
      time: "3 hours ago",
      type: "info",
      unread: false,
    },
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColorForType = (type: string, unread: boolean) => {
    if (!unread) return "bg-background";

    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Notifications
              </h1>
              <p className="text-muted-foreground">
                Stay updated with system activities and alerts
              </p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-md hover:shadow-lg transition-all duration-300">
              Mark All as Read
            </button>
          </div>

          {}
          <div className="bg-background rounded-lg shadow border border-border">
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-muted/50 transition-colors duration-200 ${getBgColorForType(
                    notification.type,
                    notification.unread
                  )}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 pt-1">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-foreground">
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{notification.time}</span>
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <span className="sr-only">Mark as read</span>⋯
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You're all caught up! No new notifications at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


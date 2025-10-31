"use client";

import React from "react";
import { Activity as ActivityIcon, AlertTriangle, CheckCircle, Users } from "lucide-react";

interface Activity {
  id: number;
  action: string;
  details: string;
  time: string;
  type: "create" | "success" | "info" | "warning";
  icon: any;
}

interface Props {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: Props) {
  return (
    <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/10 to-red-600/10">
          <ActivityIcon className="h-5 w-5 text-red-600" />
        </div>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-3 rounded-full bg-gradient-to-br from-gray-500/10 to-gray-600/10 w-fit mx-auto mb-3">
              <ActivityIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-foreground font-medium">No recent activities</p>
            <p className="text-sm text-muted-foreground">Activities will appear here when data is available</p>
          </div>
        ) : (
          activities.map((activity) => {
            const ActivityIconComponent = activity.icon || CheckCircle;
            const colorMap: Record<string, string> = {
              create: "blue",
              success: "green",
              info: "gray",
              warning: "red",
            };
            const color = colorMap[activity.type];

            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className={`p-2 rounded-lg bg-${color}-500/10 flex-shrink-0`}>
                  <ActivityIconComponent className={`h-4 w-4 text-${color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{activity.action}</p>
                  <p className="text-muted-foreground text-xs">{activity.details}</p>
                  <p className="text-muted-foreground text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button className="w-full mt-4 py-2 px-4 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-all duration-200">View All Activity</button>
    </div>
  );
}


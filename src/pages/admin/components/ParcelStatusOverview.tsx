import React from "react";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

interface Props {
  parcels: { total: number; pending: number; inTransit: number; delivered: number; flagged: number; urgent: number };
}

const StatusCard = ({ title, value, icon, color }: { title: string; value: number; icon?: React.ReactNode; color?: string }) => (
  <div className="flex items-center justify-between p-4 bg-card shadow-sm border border-border rounded-lg">
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Change</span>
        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">+0%</span>
      </div>
    </div>
    <div className={`flex items-center justify-center h-12 w-12 rounded-xl ${color || "bg-green-50"}`}>
      {icon}
    </div>
  </div>
);

export default function ParcelStatusOverview({ parcels }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard title="Total Parcels" value={parcels.total || 0} icon={<Package className="h-6 w-6 text-green-700" />} color="bg-gradient-to-br from-green-50 to-green-100" />
      <StatusCard title="In Transit" value={parcels.inTransit || 0} icon={<Truck className="h-6 w-6 text-yellow-600" />} color="bg-gradient-to-br from-yellow-50 to-yellow-100" />
      <StatusCard title="Delivered" value={parcels.delivered || 0} icon={<CheckCircle className="h-6 w-6 text-green-600" />} color="bg-gradient-to-br from-green-50 to-green-100" />
      <StatusCard title="Pending" value={parcels.pending || 0} icon={<Clock className="h-6 w-6 text-blue-600" />} color="bg-gradient-to-br from-blue-50 to-blue-100" />
    </div>
  );
}


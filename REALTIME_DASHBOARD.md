# Real-time Admin Dashboard Integration

This document explains how to integrate the real-time dashboard functionality into your admin panel.

## 🚀 Quick Integration

### Option 1: Use the Complete Component

```tsx
import AdminRealtimeDashboard from "@/components/AdminRealtimeDashboard";

export function AdminPage() {
  return (
    <div className="admin-page">
      <AdminRealtimeDashboard
        refreshInterval={10000} // 10 seconds
        showCharts={true}
        className="mb-8"
      />
      {/* Your other admin content */}
    </div>
  );
}
```

### Option 2: Use the Hook for Custom Components

```tsx
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";

export function CustomAdminDashboard() {
  const { data, isLoading, refetchAll } = useRealtimeDashboard(10000);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      {/* Total Users */}
      <div className="stat-card">
        <h3>Total Users</h3>
        <p>{data.totalUsers.toLocaleString()}</p>
      </div>

      {/* Total Parcels */}
      <div className="stat-card">
        <h3>Total Parcels</h3>
        <p>{data.totalParcels.toLocaleString()}</p>
      </div>

      {/* Active Parcels */}
      <div className="stat-card">
        <h3>Active Parcels</h3>
        <p>{data.activeParcels.toLocaleString()}</p>
      </div>

      {/* Issues & Alerts */}
      <div className="stat-card">
        <h3>Issues & Alerts</h3>
        <p>{data.issuesAndAlerts.total.toLocaleString()}</p>
        <div className="issues-breakdown">
          <span>Blocked: {data.issuesAndAlerts.blockedParcels}</span>
          <span>Held: {data.issuesAndAlerts.heldParcels}</span>
          <span>Flagged: {data.issuesAndAlerts.flaggedParcels}</span>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="status-grid">
        <div>Pending: {data.parcelStatusCounts.pending}</div>
        <div>In Transit: {data.parcelStatusCounts.inTransit}</div>
        <div>Delivered: {data.parcelStatusCounts.delivered}</div>
        <div>Cancelled: {data.parcelStatusCounts.cancelled}</div>
        <div>Returned: {data.parcelStatusCounts.returned}</div>
      </div>

      <button onClick={refetchAll}>Refresh Data</button>
    </div>
  );
}
```

## 📊 Available Data

The `useRealtimeDashboard` hook provides the following real-time data:

```typescript
interface RealtimeDashboardData {
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
    pending: number; // requested + approved
    inTransit: number; // dispatched + in-transit
    delivered: number;
    cancelled: number;
    returned: number;
  };
  lastUpdated: string;
  isLoading: boolean;
}
```

## 🔄 Real-time Features

### Automatic Polling

- Default: Updates every 10 seconds
- Configurable refresh interval
- Pauses when page is not visible

### WebSocket Integration

- Real-time notifications for new parcels
- Status change alerts
- Connection status indicators

### Performance Optimized

- RTK Query with caching
- Selective data fetching
- Minimal re-renders

## 🛠️ Configuration

### Refresh Intervals

```tsx
// Fast updates (5 seconds)
useRealtimeDashboard(5000);

// Standard updates (10 seconds)
useRealtimeDashboard(10000);

// Slower updates (30 seconds)
useRealtimeDashboard(30000);
```

### API Endpoints Used

The dashboard fetches data from these endpoints:

1. `/admin/users/stats` - Total users and breakdown
2. `/admin/parcels/active` - Active parcels count
3. `/admin/issues` - Issues and alerts summary
4. `/admin/parcels/status-counts` - Status distribution
5. `/admin/alerts` - System alerts

## 🎨 Styling

The components use Tailwind CSS classes that are compatible with dark mode:

```css
/* Light mode */
.stat-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

/* Dark mode */
.dark .stat-card {
  @apply bg-gray-800 border-gray-700;
}
```

## 🔧 Backend API Requirements

Your backend needs to implement these endpoints:

```javascript
// Express.js example routes

// GET /admin/users/stats
app.get("/admin/users/stats", async (req, res) => {
  const total = await User.countDocuments();
  const breakdown = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    statusCode: 200,
    success: true,
    data: { total, breakdown },
  });
});

// GET /admin/parcels/active
app.get("/admin/parcels/active", async (req, res) => {
  const count = await Parcel.countDocuments({
    status: { $in: ["dispatched", "in-transit"] },
  });

  res.json({
    statusCode: 200,
    success: true,
    data: { count },
  });
});

// GET /admin/issues
app.get("/admin/issues", async (req, res) => {
  const [blockedParcels, heldParcels, flaggedParcels, blockedUsers] =
    await Promise.all([
      Parcel.countDocuments({ isBlocked: true }),
      Parcel.countDocuments({ isHeld: true }),
      Parcel.countDocuments({ isFlagged: true }),
      User.countDocuments({ isBlocked: true }),
    ]);

  const total = blockedParcels + heldParcels + flaggedParcels + blockedUsers;

  res.json({
    statusCode: 200,
    success: true,
    data: { blockedParcels, heldParcels, flaggedParcels, blockedUsers, total },
  });
});

// GET /admin/parcels/status-counts
app.get("/admin/parcels/status-counts", async (req, res) => {
  const statusCounts = await Parcel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = {
    pending: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
  };

  statusCounts.forEach(({ _id, count }) => {
    if (["requested", "approved"].includes(_id)) {
      counts.pending += count;
    } else if (["dispatched", "in-transit"].includes(_id)) {
      counts.inTransit += count;
    } else if (counts.hasOwnProperty(_id)) {
      counts[_id] = count;
    }
  });

  res.json({
    statusCode: 200,
    success: true,
    data: counts,
  });
});
```

## 🧪 Testing

Test the real-time functionality:

1. **Data Updates**: Create/update parcels and verify dashboard updates
2. **Error Handling**: Test with API failures
3. **Performance**: Check with large datasets
4. **Real-time**: Verify WebSocket connections

## 🚀 Production Considerations

1. **Caching**: Implement Redis caching for expensive queries
2. **Rate Limiting**: Add rate limits to admin endpoints
3. **Monitoring**: Log dashboard API performance
4. **Security**: Ensure admin-only access to endpoints

## 📱 Mobile Responsive

The dashboard is fully responsive:

- Grid layouts adapt to screen size
- Touch-friendly refresh controls
- Optimized for mobile admin access

## 🎯 Next Steps

1. Add more detailed analytics
2. Implement push notifications
3. Add data export functionality
4. Create custom alert rules

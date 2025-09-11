# Parcel Management Module

This folder contains a refactored and modularized version of the Parcel Management system, split into meaningful, maintainable files with each file containing approximately 300 lines or less.

## File Structure

```
ParcelManagement/
├── README.md                 # This documentation file
├── index.tsx                 # Main component (entry point)
├── types.ts                  # Type definitions and interfaces
├── apiService.ts             # API service functions
├── dataTransformer.ts        # Data transformation utilities
├── hooks.ts                  # Custom React hooks
├── tableColumns.tsx          # Table columns configuration
├── modals.tsx               # Modal components
└── filterPanel.tsx          # Filter panel component
```

## File Details

### `index.tsx` (Main Component)

- **Purpose**: Main Parcel Management component that orchestrates all functionality
- **Lines**: ~260 lines
- **Key Features**:
  - State management for the entire module
  - Event handlers for all user interactions
  - Main UI layout and structure
  - Integration of all sub-components and hooks

### `filterPanel.tsx` (Filter Panel Component)

- **Purpose**: Filter and header section component
- **Lines**: ~80 lines
- **Key Features**:
  - Header with title and action buttons
  - Filter inputs for sender email, receiver email, and status
  - Clear filters and refresh functionality
  - Responsive grid layout

### `types.ts` (Type Definitions)

- **Purpose**: All TypeScript type definitions and interfaces
- **Lines**: ~200 lines
- **Key Features**:
  - `ApiParcel` interface for API response data
  - `Parcel` interface for frontend data structure
  - `StatusLogEntry`, `NotificationState`, `FilterParams` interfaces
  - Status options and type constants

### `apiService.ts` (API Service)

- **Purpose**: API communication functions
- **Lines**: ~150 lines
- **Key Features**:
  - `ParcelApiService` class with static methods
  - All CRUD operations for parcels
  - Status updates, flagging, holding, returning operations
  - Error handling and logging

### `dataTransformer.ts` (Data Transformation)

- **Purpose**: Data transformation utilities
- **Lines**: ~200 lines
- **Key Features**:
  - `ParcelDataTransformer` class
  - Transform API data to frontend format
  - Handle different API response structures
  - Search and filtering utilities

### `hooks.ts` (Custom Hooks)

- **Purpose**: Custom React hooks for state management
- **Lines**: ~150 lines
- **Key Features**:
  - `useNotification` - Notification system
  - `useParcels` - Parcel data fetching and management
  - `useParcelActions` - Parcel action operations
  - `useStatusLog` - Status log functionality

### `tableColumns.tsx` (Table Configuration)

- **Purpose**: DataTable columns configuration
- **Lines**: ~250 lines
- **Key Features**:
  - `createParcelColumns` function
  - `ParcelActionsColumn` component
  - Action buttons and dropdown menus
  - Column rendering logic

### `modals.tsx` (Modal Components)

- **Purpose**: Modal dialog components
- **Lines**: ~250 lines
- **Key Features**:
  - `ParcelDetailsModal` - View parcel details
  - `StatusUpdateModal` - Update parcel status
  - Reusable modal components
  - Form handling within modals

## Benefits of This Structure

1. **Maintainability**: Each file has a single responsibility
2. **Readability**: Smaller files are easier to understand and navigate
3. **Reusability**: Components and utilities can be reused elsewhere
4. **Testing**: Easier to write unit tests for individual modules
5. **Collaboration**: Multiple developers can work on different files simultaneously
6. **Performance**: Better tree-shaking and code splitting opportunities

## Usage

The module is used by importing the main component:

```tsx
import ParcelManagement from "./pages/admin/ParcelManagement";

// Use in your routing or component tree
<ParcelManagement />;
```

## Key Features

- ✅ Complete parcel CRUD operations
- ✅ Real-time status updates
- ✅ Advanced filtering and searching
- ✅ Bulk operations (flag, hold, return)
- ✅ Personnel assignment
- ✅ Status history tracking
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Error handling and notifications
- ✅ TypeScript type safety

## Integration Notes

The module integrates with:

- Admin layout system
- Global theme provider
- API configuration
- Authentication system
- Notification system
- Modal system
- Data table component

All integrations are handled through proper imports and the existing project architecture.

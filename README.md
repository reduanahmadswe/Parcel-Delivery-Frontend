# 📦 Parcel Delivery System - Frontend

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.5.0-646CFF?logo=vite)

A modern, enterprise-grade web application for comprehensive parcel delivery management built with React.js, TypeScript, Redux Toolkit, and Tailwind CSS. Features real-time tracking, role-based dashboards, and secure authentication.

[Live Demo](https://parcel-delivery-frontend.onrender.com) • [Report Bug](https://github.com/reduanahmadswe/Parcel-Delivery-Frontend/issues) • [Request Feature](https://github.com/reduanahmadswe/Parcel-Delivery-Frontend/issues)

</div>

---

## 🌟 Key Highlights

<table>
<tr>
<td>

- ⚡ **Lightning Fast**: Built with Vite for instant HMR and optimized production builds
- 🎯 **Type-Safe**: Full TypeScript integration for robust code quality
- 🔒 **Secure**: JWT-based authentication with Redux Persist for session management
- 🎭 **Role-Based**: Tailored dashboards for Admin, Sender, and Receiver roles
- 📱 **Responsive**: Mobile-first design with seamless desktop experience
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and Framer Motion animations

</td>
<td>

- 🔄 **Real-Time**: Live parcel tracking with comprehensive status updates
- 📊 **Analytics**: Advanced statistics and data visualization with Recharts
- 🌐 **PWA Ready**: Optimized for deployment on Render with SPA routing
- ♿ **Accessible**: WCAG compliant with proper ARIA labels
- 🧪 **Quality Code**: ESLint configured with React best practices
- 🚀 **Performance**: Optimized bundle size and lazy loading

</td>
</tr>
</table>

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [User Roles & Permissions](#-user-roles--permissions)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 🔐 Authentication & Authorization

<table>
<tr>
<td width="50%">

**User Authentication**
- 🔑 Secure login with JWT tokens
- 📝 Multi-step registration form
- 🔄 Automatic token refresh
- 🚪 Role-based route protection
- 💾 Redux Persist for session management
- 🔒 Password visibility toggle

</td>
<td width="50%">

**Session Management**
- ⏰ Automatic logout on token expiration
- 🍪 Secure cookie-based storage
- 🔐 HTTP-only token handling
- 🎭 Role-based access control
- 📱 Cross-tab authentication sync

</td>
</tr>
</table>

### 📦 Parcel Management

<table>
<tr>
<td width="50%">

**For Senders**
- ➕ Create parcels with detailed information
- 💰 Automatic delivery fee calculation
- 📍 Bangladesh division/district selection
- 📊 Statistics and analytics dashboard
- 📋 View all sent parcels
- 🔍 Filter by status and search
- 📄 Export parcel data (PDF/Excel)
- 📱 QR code generation for tracking

</td>
<td width="50%">

**For Receivers**
- 📦 Track incoming parcels
- 🔔 Real-time status notifications
- 📍 Delivery address management
- 📊 Receiving statistics
- 🕐 Status history timeline
- ✅ Delivery confirmation

</td>
</tr>
</table>

### 👥 Admin Dashboard

- � **Comprehensive Analytics**: User and parcel statistics with charts
- 👤 **User Management**: View, edit, block/unblock users
- 📦 **Parcel Management**: Full CRUD operations on all parcels
- 🔔 **Notifications System**: Manage system-wide notifications
- ⚙️ **System Settings**: Configure application settings
- 📈 **Data Visualization**: Interactive charts with Recharts
- 🔍 **Advanced Filtering**: Multi-parameter search and filter
- 📊 **Export Reports**: Generate PDF and Excel reports

### 🎨 User Interface

- 🎯 **Modern Design**: Clean and intuitive interface
- 🌓 **Dark/Light Theme**: Theme switcher with system preference detection
- 📱 **Fully Responsive**: Mobile, tablet, and desktop optimized
- ✨ **Smooth Animations**: Framer Motion for fluid transitions
- 🎨 **Beautiful Components**: Shadcn/ui inspired component library
- 🔔 **Toast Notifications**: React Hot Toast for user feedback
- 📋 **Data Tables**: Feature-rich tables with sorting and pagination
- 🎭 **Modal Dialogs**: Reusable modal components for confirmations

### 🌐 Public Features

- 🏠 **Landing Page**: Professional homepage with service overview
- 🔍 **Parcel Tracking**: Public tracking by tracking number
- 📞 **Contact Page**: Contact form and information
- 🤝 **Partners Page**: Partner and testimonials showcase

---

## � Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI library for building interactive interfaces |
| **TypeScript** | 5.2.2 | Type-safe JavaScript superset |
| **Vite** | 4.5.0 | Next-generation frontend build tool |
| **Tailwind CSS** | 3.3.6 | Utility-first CSS framework |

### State Management & Data Fetching

| Technology | Version | Purpose |
|------------|---------|---------|
| **Redux Toolkit** | 2.8.2 | State management with RTK Query |
| **RTK Query** | - | Powerful data fetching and caching |
| **Redux Persist** | 6.0.0 | Persist Redux state to localStorage |
| **React Redux** | 9.2.0 | Official React bindings for Redux |

### Form Management & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.62.0 | Performant form validation |
| **Zod** | 4.1.5 | TypeScript-first schema validation |
| **@hookform/resolvers** | 5.2.1 | Resolvers for React Hook Form |

### UI Components & Libraries

| Technology | Version | Purpose |
|------------|---------|---------|
| **Lucide React** | 0.534.0 | Beautiful and consistent icon set |
| **Framer Motion** | 12.23.12 | Production-ready motion library |
| **React Hot Toast** | 2.5.2 | Lightweight toast notifications |
| **Sonner** | 2.0.7 | Opinionated toast component |
| **Recharts** | 2.10.3 | Composable charting library |
| **Driver.js** | 1.3.1 | Product tour and onboarding |
| **React Joyride** | 2.8.2 | Create guided tours |

### Routing & Navigation

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Router DOM** | 6.20.1 | Declarative routing for React |

### HTTP Client & API

| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.11.0 | Promise-based HTTP client |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **date-fns** | 4.1.0 | Modern JavaScript date utility |
| **js-cookie** | 3.0.5 | Simple cookie handling |
| **jsPDF** | 2.5.2 | Generate PDF documents |
| **QRCode** | 1.5.4 | QR code generation |
| **clsx** | 2.1.1 | Utility for constructing className strings |
| **classnames** | 2.5.1 | Conditional className utility |
| **tailwind-merge** | 3.3.1 | Merge Tailwind CSS classes |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 8.53.0 | Code linting and quality |
| **TypeScript ESLint** | 6.10.0 | TypeScript-specific linting rules |
| **PostCSS** | 8.4.32 | CSS transformation tool |
| **Autoprefixer** | 10.4.16 | Add vendor prefixes automatically |

---

## 🏗 Project Structure

```
Parcel-Delivery-Frontend/
├── public/                          # Static assets
│   ├── _redirects                   # Render SPA routing config
│   ├── 404.html                     # Custom 404 page
│   └── render.json                  # Render deployment config
│
├── scripts/                         # Build and deployment scripts
│   └── copy-redirects.js            # Copy _redirects to dist
│
├── src/
│   ├── main.tsx                     # Application entry point
│   ├── App.tsx                      # Root component
│   ├── routes.tsx                   # Route configuration
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── AppRouter.tsx           # Router wrapper
│   │   ├── common/                 # Common components
│   │   │   ├── ProtectedRoute.tsx  # Route protection HOC
│   │   │   ├── ReusableDataTable.tsx
│   │   │   └── StatusIndicatorBadge.tsx
│   │   ├── forms/                  # Form components
│   │   │   ├── LoginForm.tsx
│   │   │   └── MultiStepRegisterForm.tsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── MainNavigationBar.tsx
│   │   │   └── ConditionalNavigation.tsx
│   │   ├── modals/                 # Modal dialogs
│   │   │   ├── ConfirmationDialog.tsx
│   │   │   ├── ParcelDetailsModal.tsx
│   │   │   └── ParcelCreatedModal.tsx
│   │   └── ui/                     # Base UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── form.tsx
│   │       ├── select.tsx
│   │       ├── theme-provider.tsx
│   │       └── DarkLightThemeSwitcher.tsx
│   │
│   ├── features/                   # Feature-based modules
│   │   ├── auth/                   # Authentication
│   │   │   ├── authSlice.ts
│   │   │   └── authApi.ts
│   │   ├── dashboard/              # Dashboard views
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── SenderDashboard.tsx
│   │   │   ├── ReceiverDashboard.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── parcels/                # Parcel management
│   │   │   └── parcelsApi.ts
│   │   └── tracking/               # Tracking features
│   │       └── StatusHistoryPage.tsx
│   │
│   ├── pages/                      # Page components
│   │   ├── auth/                   # Auth pages
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── admin/                  # Admin pages
│   │   │   ├── AdminDashboardLayout.tsx
│   │   │   ├── UserManagement/
│   │   │   ├── ParcelManagement/
│   │   │   ├── NotificationsPage.tsx
│   │   │   └── SystemSettings.tsx
│   │   ├── sender/                 # Sender pages
│   │   │   ├── CreateParcelPage.tsx
│   │   │   ├── SenderParcelsPage.tsx
│   │   │   └── SenderStatisticsPage.tsx
│   │   ├── receiver/               # Receiver pages
│   │   │   └── ReceiverDashboard.tsx
│   │   ├── public/                 # Public pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── TrackPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── PartnersPage.tsx
│   │   └── error/                  # Error pages
│   │       ├── NotFoundPage.tsx
│   │       └── UnauthorizedPage.tsx
│   │
│   ├── store/                      # Redux store configuration
│   │   ├── store.ts                # Store configuration
│   │   ├── hooks.ts                # Typed Redux hooks
│   │   ├── ReduxProvider.tsx       # Redux provider wrapper
│   │   ├── api/                    # RTK Query APIs
│   │   │   ├── apiSlice.ts
│   │   │   └── adminApi.ts
│   │   └── slices/                 # Redux slices
│   │
│   ├── services/                   # API services
│   │   ├── api.ts                  # Base API configuration
│   │   ├── ApiConfiguration.ts     # Axios instance
│   │   ├── featuresApi.ts          # Feature APIs
│   │   ├── parcelApiService.ts     # Parcel service
│   │   ├── AuthStateManager.ts     # Auth state manager
│   │   ├── TokenManager.ts         # Token management
│   │   └── parcelTypes.ts          # Parcel type definitions
│   │
│   ├── contexts/                   # React contexts
│   │   └── ReduxAuthContext.tsx    # Auth context
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── useAuth.ts              # Authentication hook
│   │
│   ├── providers/                  # Context providers
│   │   └── AppProviders.tsx        # Centralized providers
│   │
│   ├── constants/                  # Constants and configs
│   │   ├── config.ts               # App configuration
│   │   └── bangladeshData.ts       # Bangladesh locations
│   │
│   ├── types/                      # TypeScript definitions
│   │   ├── GlobalTypeDefinitions.ts
│   │   └── shims.d.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── utils.ts                # General utilities
│   │   ├── HelperUtilities.ts      # Helper functions
│   │   └── parcelExport.ts         # Export utilities
│   │
│   └── styles/                     # Global styles
│       └── globals.css             # Tailwind and global CSS
│
├── .env.example                    # Environment variables template
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.mjs              # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
├── render.yaml                     # Render deployment config
└── package.json                    # Project dependencies

```

---

## � Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) or **yarn** (v1.22.x or higher)
- **Git** - [Download](https://git-scm.com/)
- **Backend API** - The Parcel Delivery API must be running

### � Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/reduanahmadswe/Parcel-Delivery-Frontend.git
   cd Parcel-Delivery-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**

   Create a `.env` file in the root directory (or use `.env.local`):

   ```env
   # API Configuration
   VITE_API_URL=https://parcel-delivery-api.onrender.com/api
   # For local development, use:
   # VITE_API_URL=http://localhost:5000/api

   # App Configuration
   VITE_APP_NAME="Parcel Delivery System"
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5173` (Vite's default port)

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**

   ```bash
   npm run preview
   ```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=https://parcel-delivery-api.onrender.com/api

# For local development:
# VITE_API_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME="Parcel Delivery System"
VITE_APP_VERSION=1.0.0
```

### Environment Variables Description

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://parcel-delivery-api.onrender.com/api` |
| `VITE_APP_NAME` | Application name | `Parcel Delivery System` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

---

## 📜 Available Scripts

### Development Scripts

```bash
# Start development server with hot module replacement
npm run dev

# Build for production (TypeScript compilation + Vite build + copy redirects)
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint

# Run TypeScript type checking without emitting files
npm run type-check
```

### Script Details

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Starts Vite development server on port 5173 |
| `build` | `tsc && vite build && node scripts/copy-redirects.js` | Compiles TypeScript, builds for production, copies _redirects file |
| `preview` | `vite preview` | Previews production build locally |
| `lint` | `eslint src --ext ts,tsx` | Runs ESLint on all TypeScript/TSX files |
| `type-check` | `tsc --noEmit` | Checks TypeScript types without compilation |

---

## � User Roles & Permissions

### 🎭 Role Overview

This application supports three distinct user roles, each with specific permissions and access levels:

<table>
<tr>
<td width="33%">

**👤 Sender**
- Create parcel delivery requests
- View own parcels
- Cancel pending parcels
- Track parcel status
- Update profile
- Export parcel data

</td>
<td width="33%">

**📨 Receiver**
- View incoming parcels
- Track parcel delivery
- Confirm delivery
- View delivery history
- Update profile
- Receive notifications

</td>
<td width="33%">

**👨‍💼 Admin**
- Manage all users
- Manage all parcels
- Update parcel statuses
- View analytics
- System settings
- Full CRUD operations

</td>
</tr>
</table>

### Detailed Permissions

#### 👤 Sender Permissions

<table>
<tr><td>

✅ **Can Do:**
- Create new parcel delivery requests
- View all their created parcels
- Cancel parcels (only before dispatch)
- Track parcel status and history
- Update personal profile information
- Export own parcel data (PDF/Excel)
- Generate QR codes for tracking
- View sender statistics

</td></tr>
<tr><td>

❌ **Cannot Do:**
- Access other users' parcels
- Modify receiver information
- Update parcel status
- Delete parcels after dispatch
- Access admin functions
- View other users' data

</td></tr>
</table>

#### 📨 Receiver Permissions

<table>
<tr><td>

✅ **Can Do:**
- View parcels addressed to their email
- Confirm delivery for parcels
- Track parcels using tracking ID
- View complete delivery timeline
- Update personal profile
- View receiver statistics
- Receive delivery notifications

</td></tr>
<tr><td>

❌ **Cannot Do:**
- Create new parcels
- Access parcels not addressed to them
- Modify parcel details
- Cancel parcels
- Access admin functions
- View other users' data

</td></tr>
</table>

#### 👨‍💼 Admin Permissions

<table>
<tr><td>

✅ **Full Access:**
- **User Management**: View, create, update, block/unblock all users
- **Parcel Management**: View, create, update, delete all parcels
- **Status Management**: Update parcel statuses and workflow
- **System Analytics**: Access comprehensive statistics and reports
- **Notifications**: Manage system-wide notifications
- **System Settings**: Configure application settings
- **Data Export**: Export all data (PDF/Excel)
- **User Roles**: Manage user roles and permissions

</td></tr>
</table>

---

## 🌐 Page Structure & Routes

### Public Routes (No Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Landing page with features and services |
| `/track` | `TrackPage` | Public parcel tracking interface |
| `/contact` | `ContactPage` | Contact information and form |
| `/partners` | `PartnersPage` | Partners and testimonials |
| `/login` | `LoginPage` | User authentication |
| `/register` | `RegisterPage` | New user registration |

### Protected Routes (Authentication Required)

#### Common Routes (All Authenticated Users)

| Route | Component | Description |
|-------|-----------|-------------|
| `/profile` | `ProfilePage` | User profile management |

#### Sender Routes (Sender Role)

| Route | Component | Description |
|-------|-----------|-------------|
| `/sender/dashboard` | `SenderDashboard` | Sender overview and statistics |
| `/sender/create-parcel` | `CreateParcelPage` | Create new parcel form |
| `/sender/parcels` | `SenderParcelsPage` | View and manage sent parcels |
| `/sender/statistics` | `SenderStatisticsPage` | Detailed sender analytics |

#### Receiver Routes (Receiver Role)

| Route | Component | Description |
|-------|-----------|-------------|
| `/receiver/dashboard` | `ReceiverDashboard` | Receiver overview and incoming parcels |

#### Admin Routes (Admin Role)

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/dashboard` | `AdminDashboard` | System overview and analytics |
| `/admin/users` | `UserManagementPage` | User management interface |
| `/admin/parcels` | `ParcelManagementPage` | Parcel management interface |
| `/admin/notifications` | `NotificationsPage` | System notifications management |
| `/admin/settings` | `SystemSettingsPage` | System configuration |

### Error Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/unauthorized` | `UnauthorizedPage` | Access denied page |
| `*` | `NotFoundPage` | 404 page not found |

---

## 🔒 Security Features

### 🛡️ Authentication & Authorization

<table>
<tr>
<td width="50%">

**Authentication Security**
- 🔐 JWT-based authentication
- 🔄 Automatic token refresh
- 🍪 Secure cookie storage
- 🚪 Protected route middleware
- 🔑 Role-based access control
- ⏰ Session timeout handling
- 🔒 Secure logout mechanism

</td>
<td width="50%">

**Data Security**
- ✅ Input validation with Zod
- �️ XSS protection
- 🔒 CORS configuration
- 📝 Type-safe with TypeScript
- 🧹 Input sanitization
- 🚫 SQL injection prevention
- 🔐 Secure API communication

</td>
</tr>
</table>

### 🔍 Form Validation

- **Client-side Validation**: Real-time validation with React Hook Form
- **Schema Validation**: Zod schemas for type-safe validation
- **Error Handling**: User-friendly error messages
- **Required Fields**: Proper field validation
- **Email Validation**: RFC-compliant email validation
- **Password Strength**: Minimum requirements enforcement

---

## 🎨 UI/UX Features

### Design System

- 🎨 **Modern Design**: Clean and professional interface
- 🌓 **Theme Support**: Dark/Light mode with system preference detection
- 📱 **Responsive**: Mobile-first approach with breakpoints
- ✨ **Animations**: Smooth transitions with Framer Motion
- 🎯 **Accessibility**: WCAG 2.1 compliant
- 🖱️ **Interactions**: Hover states and micro-interactions

### Component Library

- 🔘 **Buttons**: Primary, secondary, outline, ghost variants
- 📝 **Forms**: Input, textarea, select, checkbox, radio
- 🃏 **Cards**: Hover effects and animations
- 📋 **Tables**: Sortable, filterable data tables
- 🔔 **Notifications**: Toast messages for user feedback
- 🎭 **Modals**: Confirmation dialogs and detail views
- 📊 **Charts**: Interactive data visualization
- 🏷️ **Badges**: Status indicators and labels

---

## � API Integration

### API Configuration

The application uses **Axios** for HTTP requests with the following features:

- **Base URL Configuration**: Centralized API endpoint
- **Request Interceptors**: Automatic token attachment
- **Response Interceptors**: Error handling and token refresh
- **RTK Query**: Efficient data fetching and caching


### API Endpoints

The frontend integrates with the following backend endpoints:

#### 🔐 Authentication Endpoints

```
POST   /auth/register          - User registration
POST   /auth/login             - User login
POST   /auth/logout            - User logout
POST   /auth/refresh-token     - Refresh JWT token
GET    /auth/me                - Get current user profile
```

#### 👤 User Management

```
GET    /users/profile          - Get user profile
PATCH  /users/profile          - Update user profile
PATCH  /users/change-password  - Change password
PUT    /users/profile/picture  - Update profile picture
```

#### 📦 Parcel Management

```
GET    /parcels/track/:trackingId  - Track parcel (public)
POST   /parcels                    - Create new parcel (sender)
GET    /parcels/me                 - Get user's parcels
GET    /parcels/:id                - Get parcel details
PATCH  /parcels/:id                - Update parcel
DELETE /parcels/:id                - Delete parcel
PATCH  /parcels/cancel/:id         - Cancel parcel (sender)
PUT    /parcels/:id/confirm-delivery - Confirm delivery (receiver)
```

#### 👨‍💼 Admin Endpoints

```
GET    /admin/stats               - System statistics
GET    /admin/dashboard           - Dashboard data
GET    /admin/parcels             - All parcels with filters
GET    /admin/users               - All users
PUT    /admin/parcels/:id/status  - Update parcel status
DELETE /admin/parcels/:id         - Delete parcel
PATCH  /admin/users/:id           - Update user
PUT    /admin/users/:id/block     - Block/Unblock user
```

### RTK Query Integration

The application uses **RTK Query** for efficient data fetching:

- **Automatic Caching**: Smart caching with tag-based invalidation
- **Optimistic Updates**: Instant UI updates
- **Automatic Refetching**: Data synchronization
- **Error Handling**: Centralized error management
- **Loading States**: Built-in loading indicators

---

## 🚀 Deployment

### 📦 Render.com (Recommended for this project)

This project is configured for Render deployment with the following files:

1. **render.yaml** - Render Blueprint configuration
2. **public/_redirects** - SPA routing configuration
3. **scripts/copy-redirects.js** - Build script to copy _redirects

#### Deploy to Render

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-api.onrender.com/api
   ```

4. **Deploy**
   - Render will automatically deploy on every push to main branch
   - SPA routing is handled by the `_redirects` file

### 🌐 Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t parcel-delivery-frontend .

# Run container
docker run -p 5173:5173 parcel-delivery-frontend
```

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the production build
# Serve using any static file server (nginx, apache, etc.)
```

---

## 🔧 Configuration Files

### Vite Configuration

The `vite.config.ts` includes:
- Path aliases (`@/`, `@/components`, etc.)
- React plugin with Fast Refresh
- PostCSS with Tailwind and Autoprefixer
- Custom plugin to copy `_redirects` file
- Production optimizations

### TypeScript Configuration

The `tsconfig.json` includes:
- Strict type checking
- ES2020 target
- React JSX support
- Path mapping for imports
- Modern module resolution

### Tailwind Configuration

Custom Tailwind setup with:
- Extended color palette
- Custom animations
- Container queries
- Typography plugin
- Dark mode support

---

## 📊 Performance Optimization

### Build Optimizations

- ⚡ **Code Splitting**: Automatic route-based splitting
- 🗜️ **Tree Shaking**: Unused code elimination
- 📦 **Bundle Analysis**: Optimized bundle sizes
- 🎯 **Lazy Loading**: Components loaded on demand
- 🖼️ **Asset Optimization**: Image and font optimization

### Runtime Optimizations

- 🔄 **Memoization**: React.memo for expensive components
- 🎣 **Custom Hooks**: Reusable logic extraction
- 📊 **Virtual Scrolling**: For large data tables
- 🌐 **API Caching**: RTK Query automatic caching
- ⏱️ **Debouncing**: Input and search optimizations

---

## 🧪 Code Quality

### ESLint Configuration

- React best practices
- TypeScript strict rules
- Hooks rules enforcement
- Import sorting
- Unused variable detection

### Code Standards

- **Naming Conventions**: camelCase for variables, PascalCase for components
- **File Structure**: Feature-based organization
- **Component Pattern**: Functional components with hooks
- **Type Safety**: Comprehensive TypeScript usage
- **Error Handling**: Proper try-catch and error boundaries

---

## 🐛 Troubleshooting

### Common Issues

#### Development server won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build fails

```bash
# Run type check to find errors
npm run type-check

# Check ESLint errors
npm run lint
```

#### API connection issues

- Verify `VITE_API_URL` in `.env` file
- Check if backend API is running
- Check browser console for CORS errors
- Verify network connectivity

#### Authentication not working

- Clear browser cookies and localStorage
- Check Redux DevTools for state
- Verify JWT token in cookies
- Check API endpoint responses

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Parcel-Delivery-Frontend.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Provide a clear description
   - Link related issues
   - Add screenshots if UI changes

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Reduan Ahmad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## �‍💻 Author

<div align="center">

### **Reduan Ahmad**

Software Engineer | Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-reduanahmadswe-181717?style=for-the-badge&logo=github)](https://github.com/reduanahmadswe)
[![Email](https://img.shields.io/badge/Email-reduanahmadswe@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:reduanahmadswe@gmail.com)

</div>

---

## 🙏 Acknowledgments

Special thanks to the following technologies and communities:

- **React Team** - For the amazing React library
- **Vite Team** - For the lightning-fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Redux Toolkit Team** - For simplified Redux development
- **Lucide Icons** - For beautiful and consistent icons
- **Framer Motion** - For smooth animations
- **Open Source Community** - For countless helpful libraries

---

## 📞 Support & Contact

<div align="center">

### Need Help?

If you encounter any issues or have questions:

- 📧 **Email**: [reduanahmadswe@gmail.com](mailto:reduanahmadswe@gmail.com)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/reduanahmadswe/Parcel-Delivery-Frontend/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/reduanahmadswe/Parcel-Delivery-Frontend/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/reduanahmadswe/Parcel-Delivery-Frontend/wiki)

</div>

---

## �️ Roadmap

Future enhancements planned:

- [ ] Real-time notifications with WebSocket
- [ ] Mobile application (React Native)
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Parcel insurance feature
- [ ] Payment gateway integration
- [ ] Driver mobile app integration
- [ ] Real-time GPS tracking
- [ ] Push notifications
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

---

## 📸 Screenshots

<div align="center">

### Landing Page
![Homepage](https://via.placeholder.com/800x450?text=Homepage+Screenshot)

### Dashboard
![Dashboard](https://via.placeholder.com/800x450?text=Dashboard+Screenshot)

### Parcel Tracking
![Tracking](https://via.placeholder.com/800x450?text=Tracking+Screenshot)

</div>

---

## 📈 Project Stats

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/reduanahmadswe/Parcel-Delivery-Frontend)
![GitHub language count](https://img.shields.io/github/languages/count/reduanahmadswe/Parcel-Delivery-Frontend)
![GitHub top language](https://img.shields.io/github/languages/top/reduanahmadswe/Parcel-Delivery-Frontend)
![GitHub last commit](https://img.shields.io/github/last-commit/reduanahmadswe/Parcel-Delivery-Frontend)

</div>

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Built with ❤️ using React, TypeScript, Vite, and Tailwind CSS**

---

**© 2025 Reduan Ahmad. All Rights Reserved.**

</div>

---
# Backend Integration Guide

This document explains the backend API integration implemented in the AgenticProjectManager-UI project.

## 🔗 Backend API Configuration

### Base URL

- **Development**: `http://localhost:3000`
- Configured in `.env` file: `VITE_API_BASE_URL`

### Keycloak Authentication

- **Keycloak URL**: `http://localhost:8080`
- **Realm**: `mcdss`
- **Client ID**: `mcdss-api`
- **Grant Type**: Password (Resource Owner Password Credentials)

All API endpoints under `/api/v1/*` require Bearer token authentication.

## 📁 Project Structure Changes

### New Files Created

1. **Authentication Service** (`src/api/authService.ts`)
   - Handles Keycloak authentication
   - Token management (access & refresh tokens)
   - User session management
   - Role-based access control

2. **Authentication Context** (`src/context/AuthContext.tsx`)
   - Global authentication state management
   - Login/logout functionality
   - User information access
   - Role checking utilities

3. **Protected Route Component** (`src/components/ProtectedRoute.tsx`)
   - Wraps protected routes requiring authentication
   - Supports role-based access control
   - Redirects to login if not authenticated
   - Shows access denied for insufficient permissions

4. **Login Page** (`src/features/auth/LoginPage.tsx`)
   - User-friendly login interface
   - Error handling and validation
   - Keycloak integration
   - Automatic redirect after successful login

### Modified Files

1. **API Configuration** (`src/api/endpoints.ts`)
   - Updated base URL to match backend
   - Added Keycloak configuration object
   - Updated endpoint paths to match backend API structure

2. **API Service** (`src/api/apiService.ts`)
   - Automatic Bearer token injection in requests
   - Token refresh on 401 errors
   - API response wrapper handling
   - Error handling for authentication failures

3. **Type Definitions** (`src/types/index.ts`)
   - Added backend API response wrapper interface
   - Updated Project status types (ACTIVE, COMPLETED, ON_HOLD, CANCELLED)
   - Added MDR status and discipline enums
   - Added S-Curve data structure from backend
   - Added authentication-related types

4. **React Hooks**
   - `useProjects.ts`: Now fetches from `/api/v1/projects`
   - `useProjectDetail.ts`: Fetches from `/api/v1/projects/:id`
   - Added `useProjectMDR` and `useProjectSCurve` hooks for separate data fetching

5. **UI Components**
   - `ProjectCard.tsx`: Updated to handle backend status types
   - `ProjectGrid.tsx`: Updated statistics calculations
   - `TopNavbar.tsx`: Added user info display and logout functionality
   - `App.tsx`: Integrated authentication and protected routes

### Updated Configuration Files

1. **Environment Variables** (`.env` & `.env.example`)
   ```bash
   VITE_API_BASE_URL=http://localhost:3000
   VITE_KEYCLOAK_URL=http://localhost:8080
   VITE_KEYCLOAK_REALM=mcdss
   VITE_KEYCLOAK_CLIENT_ID=mcdss-api
   VITE_ENV=development
   ```

## 🔐 Authentication Flow

### 1. Login Process

```
User enters credentials → AuthService.login() → Keycloak token endpoint
→ Store access_token & refresh_token → Decode JWT for user info
→ Store user in AuthContext → Redirect to dashboard
```

### 2. API Request Flow

```
API Request → apiClient interceptor → Add Bearer token
→ Backend API → Success or 401 → If 401: Refresh token
→ Retry request with new token → If refresh fails: Logout
```

### 3. Protected Routes

```
User navigates → ProtectedRoute component → Check authentication
→ If not authenticated: Redirect to /login
→ If authenticated but insufficient role: Show access denied
→ If authorized: Render requested component
```

## 📡 API Endpoints Used

### Health Check

- `GET /health` - No authentication required

### Projects

- `GET /api/v1/projects` - List all projects
  - Roles: viewer, engineer, admin
- `GET /api/v1/projects/:id` - Get project details
  - Roles: viewer, engineer, admin
  - Returns: project with mdrItems and sCurvePoints

### MDR (Material Document Register)

- `GET /api/v1/projects/:id/mdr` - Get MDR items for a project
  - Roles: viewer, engineer, admin
  - Query params: `discipline`, `status`

### S-Curve

- `GET /api/v1/projects/:id/scurve` - Get S-Curve data points
  - Roles: viewer, engineer, admin
  - Returns: Array of progress data points with earned value metrics

## 🛡️ Security Features

1. **JWT Token Management**
   - Tokens stored in localStorage
   - Automatic token refresh before expiration
   - Secure logout that clears all tokens

2. **Role-Based Access Control (RBAC)**
   - User roles extracted from JWT
   - Protected routes require specific roles
   - UI elements can be conditionally shown based on roles

3. **API Request Security**
   - All API requests include Bearer token
   - Automatic retry with token refresh on 401
   - Logout on authentication failure

4. **XSS Protection**
   - No eval() or innerHTML usage
   - JWT tokens properly decoded
   - User input sanitized

## 🚀 Usage Examples

### Using Authentication in Components

```tsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, hasRole, logout } = useAuth()

  if (!isAuthenticated) return null

  return (
    <div>
      <p>Welcome, {user?.username}</p>
      {hasRole('admin') && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Making API Calls

```tsx
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api/apiService'
import { ENDPOINTS } from '../api/endpoints'

function useMyData() {
  return useQuery({
    queryKey: ['mydata'],
    queryFn: () => apiGet(ENDPOINTS.PROJECTS),
  })
}
```

### Creating Protected Routes

```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRoles={['admin']}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

## 🔧 Development Setup

1. **Start Backend Services**

   ```bash
   # Start Keycloak (ensure it's running on port 8080)
   # Start Backend API (ensure it's running on port 3000)
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env
   # Update URLs if needed
   ```

3. **Start Frontend**

   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Login with Keycloak credentials
   - Required roles: viewer, engineer, or admin

## 📝 Testing Credentials

Configure test users in Keycloak with appropriate roles:

- **Roles**: viewer, engineer, admin
- Each role has specific permissions for API endpoints

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if Keycloak is running
   - Verify user credentials
   - Ensure user has required roles

2. **CORS Errors**
   - Backend must allow origins from `http://localhost:5173`
   - Check backend CORS configuration

3. **Token Expiration**
   - Automatic refresh should handle this
   - If issues persist, check refresh token validity

4. **Connection Refused**
   - Verify backend is running on port 3000
   - Verify Keycloak is running on port 8080
   - Check firewall settings

## 📚 Additional Resources

- **Backend API Docs**: http://localhost:3000/api-docs
- **Keycloak Admin**: http://localhost:8080/admin
- **OpenAPI Spec**: http://localhost:3000/api-docs.json

## 🔄 Migration from Mock Data

The application maintains backward compatibility with mock data in the hooks. To switch between mock and real API:

1. Real API is used by default when backend is available
2. Errors fallback gracefully with user-friendly messages
3. Mock data is still available in hook files for development reference

## 🎯 Next Steps

1. **Error Handling**: Implement global error boundary
2. **Offline Support**: Add service worker for offline functionality
3. **Real-time Updates**: Integrate WebSocket for live data updates
4. **Analytics**: Add usage tracking and performance monitoring
5. **Testing**: Add integration tests for authentication flow

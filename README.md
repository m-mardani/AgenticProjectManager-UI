# AgenticProjectManager-UI

This is the project manager of Pidmco - UI side

## 🚀 Quick Start

### Prerequisites

Before running the frontend, ensure the following services are running:

1. **Keycloak** (Authentication Server)
   - URL: `http://localhost:8080`
   - Realm: `mcdss`
   - Client: `mcdss-api`

2. **Backend API**
   - URL: `http://localhost:3000`
   - Make sure to implement the signup endpoint (`POST /api/v1/auth/signup`)
   - See `BACKEND_SIGNUP_SPEC.md` for implementation details

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will run on `http://localhost:5173` (or next available port).

### Features

- ✅ Keycloak authentication integration
- ✅ User signup/registration
- ✅ Role-based access control (viewer, engineer, admin)
- ✅ Project management dashboard
- ✅ MDR tracking
- ✅ S-Curve visualization
- ✅ Real-time project monitoring

### Documentation

- [Backend Integration Guide](BACKEND_INTEGRATION.md) - Complete authentication setup
- [Backend Signup Specification](BACKEND_SIGNUP_SPEC.md) - How to implement signup API

### Troubleshooting

**"Network Error" on login:**

- Make sure Keycloak is running on port 8080
- Make sure Backend API is running on port 3000
- Check `.env` file for correct URLs

**"useAuth must be used within AuthProvider":**

- This should auto-resolve on page refresh
- If persists, restart the dev server

## 🔐 Default Credentials

Credentials must be created in Keycloak admin console first.
See documentation for details.

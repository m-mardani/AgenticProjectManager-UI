# Backend Signup Implementation Specification

## 📋 Overview

This document provides complete specifications for implementing the user signup/registration feature on the backend.

## 🎯 Requirements

### Base Requirements

- Accept user registration requests from the frontend
- Create users in Keycloak
- Validate user input
- Assign default role (viewer)
- Return appropriate success/error responses

## 🔌 API Endpoint Specification

### POST `/api/v1/auth/signup`

**Description**: Register a new user in the system

**Authentication**: None (public endpoint)

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "username": "string (required, 3-20 characters, alphanumeric)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 8 characters)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phoneNumber": "string (optional)",
  "organization": "string (optional)"
}
```

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid-string",
    "username": "string",
    "email": "string",
    "role": "viewer"
  }
}
```

**Error Responses**:

400 Bad Request - Validation Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "username",
      "message": "Username already exists"
    },
    {
      "field": "email",
      "message": "Email is already registered"
    }
  ]
}
```

409 Conflict - User Already Exists:

```json
{
  "success": false,
  "message": "User with this username or email already exists"
}
```

500 Internal Server Error:

```json
{
  "success": false,
  "message": "Failed to create user. Please try again later."
}
```

## 🔐 Keycloak Integration

### User Creation Flow

1. **Validate Input Data**
   - Check required fields (username, email, password)
   - Validate email format
   - Validate password strength (minimum 8 characters)
   - Validate username (alphanumeric, 3-20 characters)

2. **Check Existing User**
   - Query Keycloak to check if username exists
   - Query Keycloak to check if email exists
   - Return 409 if user already exists

3. **Create User in Keycloak**

   ```javascript
   // Pseudo-code for Keycloak user creation
   const keycloakUser = {
     username: request.username,
     email: request.email,
     emailVerified: false, // Can be set to true if email verification is not needed
     enabled: true,
     firstName: request.firstName || '',
     lastName: request.lastName || '',
     attributes: {
       phoneNumber: [request.phoneNumber || ''],
       organization: [request.organization || ''],
     },
     credentials: [
       {
         type: 'password',
         value: request.password,
         temporary: false,
       },
     ],
     realmRoles: ['viewer'], // Default role
   }

   // Use Keycloak Admin API to create user
   await keycloakAdminClient.users.create(keycloakUser)
   ```

4. **Assign Default Role**
   - Assign 'viewer' role to the new user
   - Can be extended to support different default roles based on organization

5. **Return Success Response**
   - Return user ID and confirmation

## 🛠️ Implementation Guide

### Option 1: Node.js/Express Implementation

```javascript
import express from 'express'
import KcAdminClient from '@keycloak/keycloak-admin-client'

const router = express.Router()

// Initialize Keycloak Admin Client
const kcAdminClient = new KcAdminClient({
  baseUrl: process.env.KEYCLOAK_URL,
  realmName: process.env.KEYCLOAK_REALM,
})

// Authenticate admin client
await kcAdminClient.auth({
  clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
  clientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
  grantType: 'client_credentials',
})

router.post('/api/v1/auth/signup', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phoneNumber, organization } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      })
    }

    // Check if user exists
    const existingUsers = await kcAdminClient.users.find({
      username: username,
      realm: process.env.KEYCLOAK_REALM,
    })

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists',
      })
    }

    // Check if email exists
    const existingEmail = await kcAdminClient.users.find({
      email: email,
      realm: process.env.KEYCLOAK_REALM,
    })

    if (existingEmail.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      })
    }

    // Create user in Keycloak
    const newUser = await kcAdminClient.users.create({
      realm: process.env.KEYCLOAK_REALM,
      username: username,
      email: email,
      emailVerified: true,
      enabled: true,
      firstName: firstName || '',
      lastName: lastName || '',
      attributes: {
        phoneNumber: phoneNumber ? [phoneNumber] : [],
        organization: organization ? [organization] : [],
      },
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    })

    // Get the created user ID
    const userId = newUser.id

    // Assign default role 'viewer'
    const viewerRole = await kcAdminClient.roles.findOneByName({
      name: 'viewer',
      realm: process.env.KEYCLOAK_REALM,
    })

    if (viewerRole) {
      await kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        realm: process.env.KEYCLOAK_REALM,
        roles: [
          {
            id: viewerRole.id,
            name: viewerRole.name,
          },
        ],
      })
    }

    // Return success
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: userId,
        username: username,
        email: email,
        role: 'viewer',
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create user. Please try again later.',
    })
  }
})

export default router
```

### Option 2: Python/Flask Implementation

```python
from flask import Blueprint, request, jsonify
from keycloak import KeycloakAdmin
import os

auth_bp = Blueprint('auth', __name__)

# Initialize Keycloak Admin
keycloak_admin = KeycloakAdmin(
    server_url=os.getenv('KEYCLOAK_URL'),
    realm_name=os.getenv('KEYCLOAK_REALM'),
    client_id=os.getenv('KEYCLOAK_ADMIN_CLIENT_ID'),
    client_secret_key=os.getenv('KEYCLOAK_ADMIN_CLIENT_SECRET'),
    verify=True
)

@auth_bp.route('/api/v1/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()

        # Validate required fields
        if not all(key in data for key in ['username', 'email', 'password']):
            return jsonify({
                'success': False,
                'message': 'Username, email, and password are required'
            }), 400

        # Validate password length
        if len(data['password']) < 8:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 8 characters'
            }), 400

        # Check if username exists
        try:
            existing_user = keycloak_admin.get_user_id(data['username'])
            if existing_user:
                return jsonify({
                    'success': False,
                    'message': 'Username already exists'
                }), 409
        except:
            pass  # User doesn't exist, continue

        # Create user
        user_id = keycloak_admin.create_user({
            'username': data['username'],
            'email': data['email'],
            'emailVerified': True,
            'enabled': True,
            'firstName': data.get('firstName', ''),
            'lastName': data.get('lastName', ''),
            'attributes': {
                'phoneNumber': [data.get('phoneNumber', '')],
                'organization': [data.get('organization', '')]
            },
            'credentials': [{
                'type': 'password',
                'value': data['password'],
                'temporary': False
            }]
        })

        # Assign default role
        viewer_role = keycloak_admin.get_realm_role('viewer')
        keycloak_admin.assign_realm_roles(user_id, [viewer_role])

        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'data': {
                'userId': user_id,
                'username': data['username'],
                'email': data['email'],
                'role': 'viewer'
            }
        }), 201

    except Exception as e:
        print(f'Signup error: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Failed to create user. Please try again later.'
        }), 500
```

## 🧪 Testing

### Manual Testing with cURL

```bash
# Successful signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "09123456789",
    "organization": "PIDMCO"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "message": "User registered successfully",
#   "data": {
#     "userId": "uuid-here",
#     "username": "testuser",
#     "email": "testuser@example.com",
#     "role": "viewer"
#   }
# }

# Test duplicate username (should return 409)
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "another@example.com",
    "password": "password123"
  }'

# Test validation (missing required fields)
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2"
  }'
```

### Postman Collection

Create a Postman collection with the following request:

```json
{
  "info": {
    "name": "MCDSS Signup API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Signup",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"testuser@example.com\",\n  \"password\": \"password123\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"phoneNumber\": \"09123456789\",\n  \"organization\": \"PIDMCO\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/v1/auth/signup",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "v1", "auth", "signup"]
        }
      }
    }
  ]
}
```

## 🔒 Security Considerations

1. **Password Requirements**
   - Minimum 8 characters (can be increased)
   - Consider adding complexity requirements (uppercase, lowercase, numbers, special chars)
   - Consider using password strength libraries (zxcvbn, etc.)

2. **Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Example: 5 signup attempts per IP per hour

   ```javascript
   const rateLimit = require('express-rate-limit')
   const signupLimiter = rateLimit({
     windowMs: 60 * 60 * 1000, // 1 hour
     max: 5, // limit each IP to 5 requests per windowMs
     message: 'Too many signup attempts, please try again later',
   })
   router.post('/api/v1/auth/signup', signupLimiter, signupHandler)
   ```

3. **Email Verification**
   - Consider implementing email verification before account activation
   - Send verification email with token
   - User must click link to activate account

4. **Input Sanitization**
   - Sanitize all user inputs to prevent XSS attacks
   - Validate email format strictly
   - Validate username (no special characters, spaces, etc.)

5. **CORS Configuration**
   - Ensure CORS allows requests from your frontend
   ```javascript
   app.use(
     cors({
       origin: ['http://localhost:5173', 'http://localhost:5174'],
       credentials: true,
     })
   )
   ```

## 📦 Required NPM Packages (Node.js)

```json
{
  "dependencies": {
    "@keycloak/keycloak-admin-client": "^21.0.0",
    "express": "^4.18.0",
    "express-rate-limit": "^6.7.0",
    "express-validator": "^7.0.0",
    "cors": "^2.8.5"
  }
}
```

## 📦 Required Python Packages

```txt
flask>=2.3.0
python-keycloak>=2.15.0
flask-cors>=4.0.0
```

## 🌍 Environment Variables

Add these to your `.env` file:

```bash
# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=mcdss
KEYCLOAK_ADMIN_CLIENT_ID=admin-cli
KEYCLOAK_ADMIN_CLIENT_SECRET=your-admin-client-secret

# API Configuration
API_PORT=3000
API_HOST=localhost

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

## ✅ Checklist

Before deploying to production:

- [ ] Implement input validation
- [ ] Add rate limiting
- [ ] Setup email verification (optional)
- [ ] Configure CORS properly
- [ ] Add logging for signup attempts
- [ ] Add error monitoring (Sentry, etc.)
- [ ] Test all error scenarios
- [ ] Document API in OpenAPI/Swagger
- [ ] Setup automated tests
- [ ] Review security measures

## 🔗 Additional Resources

- [Keycloak Admin Client Documentation](https://www.keycloak.org/docs/latest/securing_apps/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## 📞 Support

If you need help implementing this, please refer to:

- Keycloak documentation for user management
- Your framework's documentation for HTTP request handling
- Security best practices for authentication systems

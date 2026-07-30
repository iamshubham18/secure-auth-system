# API Specification

## Project Name

Secure Authentication System

---

# Overview

This document defines the REST API endpoints for the Secure Authentication System.

The API follows RESTful principles and communicates using JSON over HTTPS.

---

# Base URL

Development

```
http://localhost:5000/api/v1
```

Production

```
https://your-domain.com/api/v1
```

---

# Authentication

The API uses:

- JWT Access Token
- Refresh Token
- HTTP Only Secure Cookies

---

# Common Response Format

## Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": []
}
```

---

# Authentication Endpoints

## Register User

### POST

```
/auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Registration successful"
}
```

### Status Codes

| Code | Meaning |
|------|---------|
|201|Created|
|400|Validation Error|
|409|Email Already Exists|

---

## Login

### POST

```
/auth/login
```

### Request

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "...",
    "user": {}
  }
}
```

### Status Codes

|Code|Meaning|
|----|-------|
|200|OK|
|401|Invalid Credentials|
|429|Too Many Requests|

---

## Logout

### POST

```
/auth/logout
```

### Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Refresh Access Token

### POST

```
/auth/refresh
```

Returns a new access token using a valid refresh token.

---

# User Endpoints

## Get Current User

### GET

```
/users/me
```

Authentication Required

---

### Response

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "USER"
  }
}
```

---

## Update Profile

### PUT

```
/users/me
```

Request

```json
{
  "name": "New Name"
}
```

---

## Change Password

### PUT

```
/users/change-password
```

Request

```json
{
  "currentPassword": "...",
  "newPassword": "..."
}
```

---

# Password Recovery

## Forgot Password

### POST

```
/auth/forgot-password
```

Request

```json
{
  "email": "john@example.com"
}
```

---

## Reset Password

### POST

```
/auth/reset-password
```

Request

```json
{
  "token": "...",
  "password": "NewPassword123!"
}
```

---

# Email Verification

## Verify Email

### POST

```
/auth/verify-email
```

---

# Sessions

## Get Active Sessions

### GET

```
/sessions
```

---

## Revoke Session

### DELETE

```
/sessions/:id
```

---

# Admin Endpoints

## Get All Users

### GET

```
/admin/users
```

Role Required

ADMIN

---

## Lock User Account

### PATCH

```
/admin/users/:id/lock
```

---

## Unlock User Account

### PATCH

```
/admin/users/:id/unlock
```

---

# Headers

```
Authorization: Bearer <AccessToken>
```

---

# HTTP Status Codes

|Code|Meaning|
|----|-------|
|200|OK|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|429|Too Many Requests|
|500|Internal Server Error|

---

# Pagination

Future endpoints returning collections will support:

```
?page=1

&limit=10
```

---

# Versioning

Current Version

```
v1
```

Example

```
/api/v1/auth/login
```

---

# API Security

The API implements:

- HTTPS
- JWT Authentication
- Refresh Tokens
- Rate Limiting
- Input Validation
- Secure Cookies
- CORS
- Helmet
- CSRF Protection

---

# Validation Rules

## Name

- Required
- Minimum 2 characters
- Maximum 50 characters

---

## Email

- Valid email format
- Unique

---

## Password

Minimum requirements:

- 8+ characters
- Uppercase
- Lowercase
- Number
- Special character

---

# Error Messages

The API returns consistent error responses.

Example

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is invalid"
    }
  ]
}
```

---

# Future Endpoints

- OAuth Login
- MFA Setup
- MFA Verification
- Device Management
- Audit Logs
- API Keys
- WebAuthn (Passkeys)

---

# Summary

This API specification defines a consistent, secure, and scalable interface between the frontend and backend. It follows RESTful conventions, standard HTTP status codes, and secure authentication practices while remaining extensible for future features.
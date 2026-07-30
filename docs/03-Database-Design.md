# Database Design

## Project Name

Secure Authentication System

---

# Overview

The Secure Authentication System uses PostgreSQL as its relational database and Prisma ORM for database access. The database is designed with security, scalability, and maintainability in mind.

The design separates authentication, session management, audit logging, and token management into dedicated tables instead of storing everything in a single table.

---

# Database Technology

| Component | Technology |
|------------|------------|
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Migration Tool | Prisma Migrate |

---

# Design Principles

- Normalize data to reduce redundancy.
- Store passwords securely using hashing.
- Separate authentication data from business logic.
- Maintain audit trails for security events.
- Support future features without major schema changes.

---

# Entity Relationship Diagram

```
User
│
├──────────────┐
│              │
│              │
▼              ▼
Session     RefreshToken
│
│
▼
AuditLog

User
│
├──────────────┐
│              │
▼              ▼
PasswordResetToken
EmailVerificationToken
```

---

# Tables

## Users

Stores registered user information.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| name | String | User's full name |
| email | String | Unique email address |
| password | String | Hashed password |
| role | Enum | USER / ADMIN |
| isVerified | Boolean | Email verification status |
| createdAt | Timestamp | Creation date |
| updatedAt | Timestamp | Last update |

---

### Constraints

- Email must be unique.
- Password is never stored in plaintext.
- UUID used as primary key.
- Role defaults to USER.

---

## Refresh Tokens

Stores active refresh tokens.

| Field | Type |
|-------|------|
| id | UUID |
| token | String |
| userId | UUID |
| expiresAt | Timestamp |
| createdAt | Timestamp |

---

Purpose

- Refresh access tokens
- Support logout
- Token rotation

---

## Sessions

Tracks active user sessions.

| Field | Type |
|-------|------|
| id | UUID |
| userId | UUID |
| ipAddress | String |
| device | String |
| userAgent | String |
| createdAt | Timestamp |
| expiresAt | Timestamp |

---

Purpose

- Session management
- Device tracking
- Login history

---

## Password Reset Tokens

| Field | Type |
|-------|------|
| id | UUID |
| token | String |
| userId | UUID |
| expiresAt | Timestamp |

---

Purpose

- Secure password reset
- Single-use reset links

---

## Email Verification Tokens

| Field | Type |
|-------|------|
| id | UUID |
| token | String |
| userId | UUID |
| expiresAt | Timestamp |

---

Purpose

- Verify email ownership
- Prevent fake accounts

---

## Audit Logs

Stores security-related events.

| Field | Type |
|-------|------|
| id | UUID |
| userId | UUID (nullable) |
| action | String |
| ipAddress | String |
| userAgent | String |
| status | String |
| createdAt | Timestamp |

---

Examples

- User Login
- Failed Login
- Password Changed
- Password Reset
- Email Verified
- Account Locked
- Logout

---

# Relationships

```
User

1 ---- N Sessions

1 ---- N RefreshTokens

1 ---- N AuditLogs

1 ---- N PasswordResetTokens

1 ---- N EmailVerificationTokens
```

---

# Indexing Strategy

Indexes improve query performance.

## Users

- email (Unique)

---

## Refresh Tokens

- token
- userId

---

## Sessions

- userId
- expiresAt

---

## Audit Logs

- userId
- createdAt

---

# Data Integrity

The database enforces:

- Unique email addresses
- Foreign key constraints
- Cascading deletes where appropriate
- Timestamp tracking
- UUID primary keys

---

# Security Considerations

## Password Storage

Passwords are hashed using bcrypt before being stored.

---

## Token Storage

Refresh tokens should be stored in hashed form when possible to reduce impact if the database is compromised.

---

## Sensitive Information

The following are **never stored**:

- Plaintext passwords
- Access tokens
- OTP codes after expiration

---

# Soft Delete Strategy

Version 1 will use hard deletes.

Future versions may introduce:

- deletedAt
- account recovery
- audit retention

---

# Future Database Enhancements

Potential additions include:

- OAuth Accounts
- Multi-Factor Authentication Secrets
- Trusted Devices
- API Keys
- Security Notifications
- Device Fingerprints
- Login Attempt Tracking

---

# Database Naming Conventions

- Table names: PascalCase in Prisma models
- Database tables: snake_case
- Primary key: id
- Foreign key: userId
- Timestamps: createdAt, updatedAt

---

# Summary

The database is designed to support a secure authentication system with proper separation of concerns. Authentication, session management, logging, and token handling are isolated into dedicated tables, enabling better security, scalability, and maintainability.
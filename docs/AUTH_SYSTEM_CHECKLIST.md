# Step-by-Step Guide: Checking for a Complete Custom Authentication System

This guide helps you audit your app’s source code to ensure you have all essential parts of a custom authentication system implemented.

---

## 1. **User Model**

- [ ] Does your database (e.g., PostgreSQL) have a table for users?
    - Typical fields: `id`, `email`, `password_hash`, `created_at`, `updated_at`
- [ ] Is your ORM (e.g., Sequelize, Prisma) or migration script creating this table?

## 2. **User Registration (Sign-Up)**

- [ ] Is there a registration endpoint (e.g., `/api/register`, `/auth/signup`)?
- [ ] Does it validate input (email format, password rules)?
- [ ] Is the password being hashed before being stored (e.g., bcrypt, argon2)?
- [ ] Does it check for duplicate emails before creating a user?

## 3. **User Login (Sign-In)**

- [ ] Is there a login endpoint (e.g., `/api/login`, `/auth/signin`)?
- [ ] Does it check for existing user by email/username?
- [ ] Is the password compared securely (using the hash, not plain text)?
- [ ] Are failed logins handled gracefully (no leaking of information)?

## 4. **JWT Issuance**

- [ ] After successful login, is a JWT access token generated and returned to the user?
- [ ] Is the JWT signed using your `JWT_SECRET`?
- [ ] Is there a refresh token mechanism (`JWT_REFRESH_SECRET`) to renew sessions?

## 5. **Authentication Middleware**

- [ ] Is there middleware to verify JWTs for protected API routes?
- [ ] Is access properly restricted—only authenticated users can access protected resources?

## 6. **Password Reset & Email Verification (Optional but Recommended)**

- [ ] Is there functionality for requesting a password reset (via email)?
- [ ] Are tokenized reset links and procedures in place?
- [ ] Do you verify user emails at registration?

## 7. **Logout / Token Blacklisting (Optional for Security)**

- [ ] Can users revoke their refresh tokens?
- [ ] Is there a blacklist or invalidation system for tokens (recommended for security)?

## 8. **User Management & Security Best Practices**

- [ ] Are sensitive data fields never exposed in API responses?
- [ ] Are there rate limits on registration/login endpoints?
- [ ] Are passwords, tokens, and secrets never committed to code repository?
- [ ] Are environment variables being used for secrets?

---

## **How to Check:**
- Search your codebase for the endpoints listed above (`register`, `login`, etc.).
- Look for modules/files containing authentication logic, password handling, and user models.
- Confirm the presence and usage of middleware for protected routes.
- Review your environment configuration for JWT secrets.

---

## **Outcome**
If you’ve checked all boxes above, your authentication system is sufficiently robust and custom-built for typical use-cases.
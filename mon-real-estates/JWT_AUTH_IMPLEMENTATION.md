# JWT Authentication System Implementation

## Overview

This document describes the implementation of a secure JWT-based authentication system using Access Tokens + Refresh Tokens for the Mon Real Estate application.

## Architecture

### Token Strategy

1. **Access Token**
   - Short-lived (15 minutes)
   - Used for API requests
   - Stored in memory/localStorage
   - Contains user ID, email, and role

2. **Refresh Token**
   - Long-lived (30 days)
   - Used to generate new access tokens
   - Stored as HTTP-only cookie
   - Random 64-byte hex string
   - Stored in database with expiration

## Backend Changes

### 1. User Model Updates
- Added `refreshTokens` array field to store multiple refresh tokens
- Each refresh token has automatic expiration (30 days)

### 2. Token Generation (`utils/generateToken.js`)
- `generateAccessToken()`: Creates JWT access token (15min)
- `generateRefreshToken()`: Creates random refresh token (30 days)
- `generateTokens()`: Creates both tokens
- `verifyAccessToken()`: Verifies JWT access token

### 3. Auth Controller Updates
- **Login/Register**: Generate both tokens, store refresh token in DB and cookie
- **Refresh Token Endpoint**: `/auth/refresh` - validates refresh token and issues new access token
- **Logout**: `/auth/logout` - removes refresh token from DB and clears cookie
- **Logout All**: `/auth/logout-all` - removes all refresh tokens for user

### 4. Middleware Updates
- Updated `authenticate` middleware to use access tokens only
- Better error handling for expired tokens (returns `TOKEN_EXPIRED` code)

### 5. New Routes
```javascript
POST /auth/refresh     // Refresh access token
POST /auth/logout      // Logout from current device
POST /auth/logout-all  // Logout from all devices
```

### 6. Security Features
- HTTP-only cookies for refresh tokens
- Refresh token rotation (new refresh token on each refresh)
- Secure cookie settings for production
- CORS with credentials enabled

## Frontend Changes

### 1. API Service Updates (`services/api.js`)
- Automatic token refresh on 401 errors
- Request queuing during token refresh
- Proper error handling and fallback to login
- HTTP-only cookie support (`withCredentials: true`)

### 2. Auth Context Updates (`context/AuthContext.jsx`)
- Updated to use `accessToken` instead of `token`
- Automatic token refresh on app initialization
- Event-driven logout handling
- Support for logout and logoutAll functions

### 3. Token Management
- Access tokens stored in localStorage
- Refresh tokens handled automatically via cookies
- Automatic cleanup on authentication failure

## Security Improvements

1. **Short-lived Access Tokens**: Reduces exposure window if compromised
2. **HTTP-only Cookies**: Prevents XSS attacks on refresh tokens
3. **Token Rotation**: New refresh token issued on each refresh
4. **Database Storage**: Refresh tokens stored securely in database
5. **Automatic Cleanup**: Expired tokens automatically removed
6. **CORS Security**: Proper CORS configuration with credentials

## API Flow

### Login Flow
1. User submits credentials
2. Server validates credentials
3. Server generates access + refresh tokens
4. Access token returned in response
5. Refresh token set as HTTP-only cookie
6. Frontend stores access token and user data

### API Request Flow
1. Frontend attaches access token to request
2. If token valid: Request processed
3. If token expired: Server returns 401 with `TOKEN_EXPIRED`
4. Frontend automatically calls `/auth/refresh`
5. New access token received and stored
6. Original request retried with new token

### Logout Flow
1. Frontend calls `/auth/logout`
2. Server removes refresh token from database
3. Server clears refresh token cookie
4. Frontend clears access token and user data

## Environment Variables

### Backend (.env)
```env
JWT_SECRET=your_super_secure_random_string_here_make_it_long_and_complex_123456789
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4444
```

## Testing the Implementation

### 1. Login Test
```javascript
// Should receive accessToken in response and refreshToken in cookie
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
});
```

### 2. Protected Route Test
```javascript
// Should work with valid access token
const response = await fetch('/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${accessToken}` },
  credentials: 'include'
});
```

### 3. Token Refresh Test
```javascript
// Should automatically refresh when access token expires
// Frontend handles this automatically via axios interceptors
```

### 4. Logout Test
```javascript
// Should clear refresh token and cookie
const response = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});
```

## Migration Notes

### Backward Compatibility
- Old `token` field in localStorage will be ignored
- Existing users need to login again to get new token format
- API endpoints remain the same (except new refresh/logout endpoints)

### Database Migration
- New `refreshTokens` field added to User model
- Existing users will have empty `refreshTokens` array initially
- No data loss or breaking changes

## Security Considerations

1. **Access Token Storage**: Consider using memory-only storage for maximum security
2. **Refresh Token Rotation**: Implemented to prevent token reuse attacks
3. **HTTPS Only**: Ensure secure cookies work only over HTTPS in production
4. **Token Cleanup**: Implement periodic cleanup of expired refresh tokens
5. **Rate Limiting**: Consider adding rate limiting to refresh endpoint

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure `credentials: true` in CORS config
2. **Cookie Not Set**: Check `withCredentials: true` in frontend requests
3. **Token Refresh Loop**: Ensure proper error handling in axios interceptors
4. **Logout Not Working**: Verify refresh token is being sent in requests

### Debug Tips
1. Check browser cookies for `refreshToken`
2. Monitor network requests for proper Authorization headers
3. Check server logs for token validation errors
4. Verify environment variables are loaded correctly

## Future Enhancements

1. **Token Blacklisting**: Implement access token blacklist for immediate revocation
2. **Device Management**: Track and manage user devices/sessions
3. **Security Monitoring**: Log suspicious authentication activities
4. **Multi-factor Authentication**: Add 2FA support
5. **Social Login**: Integrate OAuth providers

## Conclusion

The new JWT authentication system provides enhanced security through:
- Short-lived access tokens (15 minutes)
- Secure refresh token storage (HTTP-only cookies)
- Automatic token refresh
- Proper session management
- Secure logout functionality

The implementation maintains backward compatibility while significantly improving security posture.
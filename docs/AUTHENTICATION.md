# Authentication System Implementation Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Implementation Steps](#implementation-steps)
4. [API Integration](#api-integration)
5. [Session Management](#session-management)
6. [Security Considerations](#security-considerations)

## Overview

This document outlines the implementation plan for integrating the authentication system with the Edukai platform. The system will handle user authentication, session management, and protected routes.

## Architecture

### Directory Structure

```
src/
├── services/
│   └── auth.ts             # Auth service (following existing pattern)
├── lib/
│   ├── session.ts          # Session management
│   └── actions/
│       └── auth.ts         # Auth actions
├── hooks/
│   └── useSession.ts       # Session hook
├── providers/
│   └── SessionProvider.tsx # Session context provider
└── middleware.ts           # Auth middleware (Next.js 13+ pattern)
```

## Implementation Steps

### 1. API Service Layer

#### Auth Service (`services/auth.ts`)

```typescript
import axios from "axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email?: string;
}

export function useAuthService() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const login = async (credentials: LoginCredentials) => {
    const response = await axios.post(`${apiUrl}/api/auth/login`, credentials, {
      withCredentials: true,
    });
    return response.data;
  };

  const register = async (userData: RegisterData) => {
    const response = await axios.post(`${apiUrl}/api/auth/register`, userData, {
      withCredentials: true,
    });
    return response.data;
  };

  return { login, register };
}
```

### 2. Session Management

#### Session Storage (`lib/session.ts`)

```typescript
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export const sessionStorage = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
```

#### Session Context (`providers/SessionProvider.tsx`)

```typescript
import { createContext, useContext, useState, useEffect } from "react";
import { sessionStorage } from "@/lib/session";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize session
    const token = sessionStorage.getToken();
    if (token) {
      // Validate token and get user data
    }
    setLoading(false);
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading }}>
      {children}
    </SessionContext.Provider>
  );
}
```

### 3. API Integration

#### Auth Actions (`lib/actions/auth.ts`)

```typescript
import { useAuthService, LoginCredentials } from "@/services/auth";
import { sessionStorage } from "@/lib/session";

export async function signinAction(credentials: LoginCredentials) {
  const authService = useAuthService();
  try {
    const response = await authService.login(credentials);
    sessionStorage.setToken(response.token);
    sessionStorage.setUser(response.user);
    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

### 4. Protected Routes

#### Auth Middleware (`middleware.ts`)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}
```

## Security Considerations

1. **Token Storage**

   - Store tokens in HttpOnly cookies when possible
   - Implement token refresh mechanism
   - Set appropriate token expiration

2. **Request Security**

   - Use HTTPS for all API calls
   - Implement CSRF protection
   - Add rate limiting for auth endpoints

3. **Error Handling**
   - Implement proper error messages
   - Log security-related events
   - Handle token expiration gracefully

## Testing Checklist

1. **Authentication Flow**

   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials
   - [ ] Registration with valid data
   - [ ] Registration with existing username
   - [ ] Password validation
   - [ ] Token storage and retrieval

2. **Session Management**

   - [ ] Session persistence
   - [ ] Token refresh
   - [ ] Session timeout
   - [ ] Logout functionality

3. **Protected Routes**

   - [ ] Access to protected routes with valid token
   - [ ] Redirect to login for invalid/missing token
   - [ ] Proper error handling

4. **Security**
   - [ ] CSRF protection
   - [ ] XSS prevention
   - [ ] Rate limiting
   - [ ] Secure cookie settings

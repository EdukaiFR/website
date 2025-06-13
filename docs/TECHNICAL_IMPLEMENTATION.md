# Technical Implementation Guide

## Environment Setup

1. Add required environment variables to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_COOKIE_NAME=auth_token
NEXT_PUBLIC_AUTH_COOKIE_DOMAIN=localhost
```

## Dependencies

Add these to your `package.json` (axios is already installed):

```json
{
  "dependencies": {
    "js-cookie": "^3.0.5",
    "jwt-decode": "^4.0.0"
  }
}
```

## Implementation Details

### 1. API Service Layer

#### Auth Service (following existing pattern)

```typescript
// services/auth.ts
import axios from "axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
  };
}

export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<{ token: string }>;
}

export function useAuthService(): AuthService {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        credentials,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/register`,
        userData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(
        `${apiUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const refreshToken = async (): Promise<{ token: string }> => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/refresh`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Refresh token error:", error);
      throw error;
    }
  };

  return { login, register, logout, refreshToken };
}
```

### 2. Session Management

#### Session Storage

```typescript
// lib/session.ts
import Cookies from "js-cookie";

const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "auth_token";
const USER_KEY = "user_data";

export const sessionStorage = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, {
      domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  setUser: (user: any) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  clearSession: () => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
```

#### Session Hook

```typescript
// hooks/useSession.ts
import { useState, useEffect } from "react";
import { sessionStorage } from "@/lib/session";
import { useAuthService, LoginCredentials } from "@/services/auth";

export function useSession() {
  const [user, setUser] = useState(sessionStorage.getUser());
  const [loading, setLoading] = useState(true);
  const authService = useAuthService();

  useEffect(() => {
    const token = sessionStorage.getToken();
    if (token && !user) {
      // Validate token and get user data
      validateSession();
    } else {
      setLoading(false);
    }
  }, []);

  const validateSession = async () => {
    try {
      const response = await authService.refreshToken();
      sessionStorage.setToken(response.token);
      // Get user data and update state
      setLoading(false);
    } catch (error) {
      sessionStorage.clearSession();
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      sessionStorage.setToken(response.token);
      sessionStorage.setUser(response.user);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      sessionStorage.clearSession();
      setUser(null);
    } catch (error) {
      // Even if logout fails on server, clear local session
      sessionStorage.clearSession();
      setUser(null);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}
```

### 3. API Integration

#### Updated Auth Actions

```typescript
// lib/actions/auth.ts
import {
  useAuthService,
  LoginCredentials,
  RegisterData,
} from "@/services/auth";
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

export async function signupAction(userData: RegisterData) {
  const authService = useAuthService();
  try {
    const response = await authService.register(userData);
    sessionStorage.setToken(response.token);
    sessionStorage.setUser(response.user);
    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

### 4. Protected Routes

#### Auth Middleware

```typescript
// middleware/auth.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/auth", "/api/auth"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (!token) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
```

### 5. Error Handling

#### API Error Handler

```typescript
// lib/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: any) => {
  if (error.response) {
    throw new ApiError(
      error.response.status,
      error.response.data.message || "An error occurred",
      error.response.data.code
    );
  }
  throw new ApiError(500, "Network error");
};
```

## Testing

### Unit Tests

```typescript
// __tests__/auth.test.ts
import { useAuthService } from "@/services/auth";
import { sessionStorage } from "@/lib/session";

describe("Auth Service", () => {
  let authService: ReturnType<typeof useAuthService>;

  beforeEach(() => {
    authService = useAuthService();
    sessionStorage.clearSession();
  });

  it("should login successfully", async () => {
    const credentials = {
      username: "testuser",
      password: "password123",
    };

    const response = await authService.login(credentials);
    expect(response.token).toBeDefined();
    expect(response.user).toBeDefined();
  });

  it("should handle invalid credentials", async () => {
    const credentials = {
      username: "testuser",
      password: "wrongpassword",
    };

    await expect(authService.login(credentials)).rejects.toThrow();
  });

  it("should register successfully", async () => {
    const userData = {
      username: "newuser",
      password: "password123",
      email: "newuser@example.com",
    };

    const response = await authService.register(userData);
    expect(response.token).toBeDefined();
    expect(response.user).toBeDefined();
  });
});
```

## Security Best Practices

1. **Token Management**

   - Use HttpOnly cookies for token storage
   - Implement token refresh mechanism
   - Set appropriate token expiration (e.g., 15 minutes for access token)
   - Use secure and sameSite cookie attributes

2. **Request Security**

   - Implement CSRF protection using SameSite cookies
   - Add rate limiting for auth endpoints
   - Validate all input data
   - Use HTTPS in production

3. **Error Handling**

   - Don't expose sensitive information in error messages
   - Log security-related events
   - Implement proper error boundaries

4. **Session Management**
   - Clear session data on logout
   - Implement session timeout
   - Handle concurrent sessions if needed

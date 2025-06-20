# Authentication Quick Start Guide

## Setup

1. Install dependencies (axios is already installed):

```bash
pnpm add js-cookie jwt-decode
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_COOKIE_NAME=auth_token
NEXT_PUBLIC_AUTH_COOKIE_DOMAIN=localhost
```

## Implementation Steps

1. **Create Auth Service**

   - Copy `services/auth.ts` (following existing service pattern)
   - Update API endpoints if needed

2. **Setup Session Management**

   - Copy `lib/session.ts`
   - Copy `hooks/useSession.ts`
   - Add `SessionProvider` to your app

3. **Add Auth Middleware**

   - Copy `middleware.ts` (Next.js 13+ pattern)
   - Update protected routes if needed

4. **Update Auth Forms**
   - Use `useSession` hook in your forms
   - Handle loading and error states

## Usage Example

```typescript
// In your login form
import { useSession } from "@/hooks/useSession";

export function LoginForm() {
  const { login, loading } = useSession();

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      // Redirect or show success message
    } catch (error) {
      // Handle error
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form fields */}</form>;
}
```

## Protected Routes

```typescript
// In your page component
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/router";

export default function ProtectedPage() {
  const { user, loading } = useSession();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  return <div>Protected Content</div>;
}
```

## Common Issues

1. **CORS Issues**

   - Ensure API server allows credentials
   - Check cookie domain settings

2. **Token Not Persisting**

   - Verify cookie settings
   - Check if using HTTPS in production

3. **Auth State Not Updating**
   - Ensure SessionProvider is at root level
   - Check if token is being stored correctly

## Testing

1. Run unit tests:

```bash
pnpm test
```

2. Test auth flow:
   - Login with valid credentials
   - Try invalid credentials
   - Test protected routes
   - Verify session persistence

## Next Steps

1. Implement refresh token logic
2. Add rate limiting
3. Set up error monitoring
4. Add session timeout

import { sessionStorage } from "@/lib/session";

/**
 * Get the current authenticated user from session storage
 * @returns User object or null if not authenticated
 */
export function getCurrentUser() {
  return sessionStorage.getUser();
}

/**
 * Get the current user's ID
 * @returns User ID string or null if not authenticated
 */
export function getCurrentUserId(): string | null {
  const user = getCurrentUser();
  return user?.id || null;
}

/**
 * Check if user is authenticated
 * @returns boolean indicating if user is logged in
 */
export function isAuthenticated(): boolean {
  const token = sessionStorage.getToken();
  const user = sessionStorage.getUser();
  return !!(token && user);
}

/**
 * Get authorization headers for API calls
 * @returns Headers object with authorization token
 */
export function getAuthHeaders() {
  const token = sessionStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Create axios config with authentication
 * @returns Axios config object with credentials and auth headers
 */
export function getAuthConfig() {
  return {
    withCredentials: true,
    headers: getAuthHeaders(),
  };
}

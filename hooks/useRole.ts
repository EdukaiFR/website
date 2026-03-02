import { useSession } from "./useSession";

// User role constants
export const USER_ROLES = {
    USER: "user",
    ADMIN: "admin",
    TRIAGE: "triage",
    DEV: "dev",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface RolePermissions {
    canAccessAdminEndpoints: boolean;
}

export function useUserRole(): UserRole {
    const { user, loading } = useSession();

    // If still loading, don't resolve the role yet
    if (loading) {
        return USER_ROLES.USER;
    }

    // If the session has finished loading
    if (!loading && user) {
        const role = (user.role as UserRole) || USER_ROLES.USER;
        return role;
    }

    // Session loaded but no user (disconnected)
    return USER_ROLES.USER;
}

export function useIsAdmin(): boolean {
    const role = useUserRole();
    return role === USER_ROLES.ADMIN;
}

export function useRolePermissions(): RolePermissions {
    const role = useUserRole();

    switch (role) {
        case USER_ROLES.ADMIN:
            return {
                canAccessAdminEndpoints: true,
            };
        case USER_ROLES.TRIAGE:
        case USER_ROLES.DEV:
        case USER_ROLES.USER:
        default:
            return {
                canAccessAdminEndpoints: false,
            };
    }
}

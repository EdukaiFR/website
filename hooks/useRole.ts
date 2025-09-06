import { useSession } from "./useSession";

// User role constants
export const USER_ROLES = {
    USER: "user",
    ADMIN: "admin",
    TRIAGE: "triage",
    DEV: "dev"
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface RolePermissions {
    canModifyAnyTicket: boolean;
    canReopenAnyTicket: boolean;
    canSeeInternalComments: boolean;
    canCreateInternalComments: boolean;
    canAccessAdminEndpoints: boolean;
    canAssignTickets: boolean;
    canViewAllTickets: boolean;
}

export function useUserRole(): UserRole {
    const { user, loading } = useSession();
    
    // Si encore en chargement, ne pas résoudre le rôle tout de suite
    if (loading) {
        return USER_ROLES.USER;
    }
    
    // Si la session a fini de charger
    if (!loading && user) {
        const role = ((user as any).role as UserRole) || USER_ROLES.USER;
        return role;
    }
    
    // Session chargée mais pas d'utilisateur (déconnecté)
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
                canModifyAnyTicket: true,
                canReopenAnyTicket: true,
                canSeeInternalComments: true,
                canCreateInternalComments: true,
                canAccessAdminEndpoints: true,
                canAssignTickets: true,
                canViewAllTickets: true,
            };
        case USER_ROLES.TRIAGE:
            return {
                canModifyAnyTicket: true,
                canReopenAnyTicket: true,
                canSeeInternalComments: true,
                canCreateInternalComments: true,
                canAccessAdminEndpoints: false,
                canAssignTickets: true,
                canViewAllTickets: true,
            };
        case USER_ROLES.DEV:
            return {
                canModifyAnyTicket: false,
                canReopenAnyTicket: false,
                canSeeInternalComments: true,
                canCreateInternalComments: true,
                canAccessAdminEndpoints: false,
                canAssignTickets: false,
                canViewAllTickets: true,
            };
        case USER_ROLES.USER:
        default:
            return {
                canModifyAnyTicket: false,
                canReopenAnyTicket: false,
                canSeeInternalComments: false,
                canCreateInternalComments: false,
                canAccessAdminEndpoints: false,
                canAssignTickets: false,
                canViewAllTickets: false,
            };
    }
}

export function canUserModifyTicket(
    userRole: UserRole, 
    userId: string, 
    ticketReporterId: string
): boolean {
    // Admins and triage can modify any ticket
    if (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.TRIAGE) {
        return true;
    }
    
    // Users can only modify their own tickets
    return userId === ticketReporterId;
}

export function canUserReopenTicket(
    userRole: UserRole, 
    userId: string, 
    ticketReporterId: string
): boolean {
    // Admins and triage can reopen any ticket
    if (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.TRIAGE) {
        return true;
    }
    
    // Users can only reopen their own tickets
    return userId === ticketReporterId;
}
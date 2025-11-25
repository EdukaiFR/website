/**
 * Plan types available in the system
 */
export type Plan = "free" | "premium";

/**
 * Available limit names for resource usage control
 */
export type LimitName =
    | "QUIZ_QUESTIONS_PER_GENERATION"
    | "SHEET_MAX_TOKENS"
    | "GENERATIONS_PER_MONTH"
    | "REGENERATIONS_PER_MONTH";

/**
 * Single plan limit entity from database
 */
export interface PlanLimit {
    _id: string;
    limitName: LimitName;
    plan: Plan;
    value: number;
    description: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Limit values for free and premium plans
 */
export interface LimitByPlan {
    free: number;
    premium: number;
    description: string;
}

/**
 * Grouped limits by limit name for easier admin UI
 */
export interface GroupedLimits {
    [key: string]: LimitByPlan;
}

/**
 * API response for getting all limits
 */
export interface GetAllLimitsResponse {
    status: "success" | "failure";
    message: string;
    items: PlanLimit[];
}

/**
 * API response for getting grouped limits
 */
export interface GetGroupedLimitsResponse {
    status: "success" | "failure";
    message?: string;
    items: GroupedLimits;
}

/**
 * API response for getting a specific limit
 */
export interface GetLimitResponse {
    status: "success" | "failure";
    message?: string;
    item: {
        limitName: LimitName;
        free: {
            _id: string;
            value: number;
            description: string;
        };
        premium: {
            _id: string;
            value: number;
            description: string;
        };
    };
}

/**
 * Request body for updating a limit
 */
export interface UpdateLimitRequest {
    plan: Plan;
    value: number;
}

/**
 * API response for updating a limit
 */
export interface UpdateLimitResponse {
    status: "success" | "failure";
    message: string;
    item: {
        limitName: LimitName;
        plan: Plan;
        value: number;
        previousValue: number;
        description: string;
        updatedAt: string;
    };
}

/**
 * API response for refresh cache endpoint
 */
export interface RefreshCacheResponse {
    status: "success" | "failure";
    message: string;
}

/**
 * API response for seed endpoint
 */
export interface SeedLimitsResponse {
    status: "success" | "failure";
    message: string;
    item: {
        created: number;
        existing: number;
    };
}

/**
 * Human-readable label for limit names
 */
export const LIMIT_LABELS: Record<LimitName, string> = {
    QUIZ_QUESTIONS_PER_GENERATION: "Questions par quiz",
    SHEET_MAX_TOKENS: "Tokens max pour fiches",
    GENERATIONS_PER_MONTH: "Générations mensuelles",
    REGENERATIONS_PER_MONTH: "Régénérations mensuelles",
};

/**
 * Helper to format limit value display (-1 = unlimited)
 */
export function formatLimitValue(value: number): string {
    return value === -1 ? "Illimité" : value.toString();
}

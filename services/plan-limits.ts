import { ApiError } from "@/lib/types/api";
import {
    GetAllLimitsResponse,
    GetGroupedLimitsResponse,
    GetLimitResponse,
    LimitName,
    RefreshCacheResponse,
    SeedLimitsResponse,
    UpdateLimitRequest,
    UpdateLimitResponse,
} from "@/lib/types/plan-limits";
import axios from "axios";

/**
 * Service for managing plan limits (admin only)
 * Optimized with proper error handling and TypeScript types
 */
export interface PlanLimitsService {
    getAllLimits: () => Promise<GetAllLimitsResponse>;
    getGroupedLimits: () => Promise<GetGroupedLimitsResponse>;
    getLimit: (limitName: LimitName) => Promise<GetLimitResponse>;
    updateLimit: (
        limitName: LimitName,
        data: UpdateLimitRequest
    ) => Promise<UpdateLimitResponse>;
    refreshCache: () => Promise<RefreshCacheResponse>;
    seedLimits: () => Promise<SeedLimitsResponse>;
}

/**
 * Hook to create plan limits service instance
 * Uses withCredentials for authentication
 */
export function usePlanLimitsService(): PlanLimitsService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const baseUrl = `${apiUrl}/admin/plan-limits`;

    const getAllLimits = async (): Promise<GetAllLimitsResponse> => {
        try {
            const response = await axios.get<GetAllLimitsResponse>(baseUrl, {
                withCredentials: true,
            });
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                "Failed to get all limits:",
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    const getGroupedLimits = async (): Promise<GetGroupedLimitsResponse> => {
        try {
            const response = await axios.get<GetGroupedLimitsResponse>(
                `${baseUrl}/grouped`,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                "Failed to get grouped limits:",
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    const getLimit = async (
        limitName: LimitName
    ): Promise<GetLimitResponse> => {
        try {
            const response = await axios.get<GetLimitResponse>(
                `${baseUrl}/${limitName}`,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                `Failed to get limit ${limitName}:`,
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    const updateLimit = async (
        limitName: LimitName,
        data: UpdateLimitRequest
    ): Promise<UpdateLimitResponse> => {
        try {
            const response = await axios.patch<UpdateLimitResponse>(
                `${baseUrl}/${limitName}`,
                data,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                `Failed to update limit ${limitName}:`,
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    const refreshCache = async (): Promise<RefreshCacheResponse> => {
        try {
            const response = await axios.post<RefreshCacheResponse>(
                `${baseUrl}/refresh`,
                {},
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                "Failed to refresh cache:",
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    const seedLimits = async (): Promise<SeedLimitsResponse> => {
        try {
            const response = await axios.post<SeedLimitsResponse>(
                `${baseUrl}/seed`,
                {},
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error(
                "Failed to seed limits:",
                err.response?.data?.message || err.message
            );
            throw error;
        }
    };

    return {
        getAllLimits,
        getGroupedLimits,
        getLimit,
        updateLimit,
        refreshCache,
        seedLimits,
    };
}

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AUTH_ENDPOINTS } from "@/lib/constants/auth";
import { sessionStorage } from "@/lib/session";

interface QueueItem {
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
    config: InternalAxiosRequestConfig;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

/**
 * @param error Error to resolve or reject for each queued request
 */
function processQueue(error: AxiosError | null): void {
    failedQueue.forEach((item) => {
        if (error) {
            item.reject(error);
        } else {
            item.resolve(axios(item.config));
        }
    });
    failedQueue = [];
}

/**
 * @param url Request URL to check
 * @returns Whether the URL is an auth endpoint that should skip 401 interception
 */
function isAuthEndpoint(url: string | undefined): boolean {
    if (!url) return false;
    return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isAuthEndpoint(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject, config: originalRequest });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(
                `${apiUrl}/auth/refresh`,
                {},
                { withCredentials: true }
            );
            sessionStorage.setToken(response.data.token);
            processQueue(null);
            return axios(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError as AxiosError);
            sessionStorage.clearSession();
            if (typeof window !== "undefined") {
                window.location.href = "/auth";
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

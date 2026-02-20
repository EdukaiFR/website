import axios from "axios";
import { vi } from "vitest";

/**
 * Mock a successful axios.get response.
 */
export function mockAxiosGet<T>(data: T, status: number = 200): void {
    vi.mocked(axios.get).mockResolvedValue({ data, status });
}

/**
 * Mock a successful axios.post response.
 */
export function mockAxiosPost<T>(data: T, status: number = 200): void {
    vi.mocked(axios.post).mockResolvedValue({ data, status });
}

/**
 * Mock a successful axios.put response.
 */
export function mockAxiosPut<T>(data: T, status: number = 200): void {
    vi.mocked(axios.put).mockResolvedValue({ data, status });
}

/**
 * Mock a successful axios.delete response.
 */
export function mockAxiosDelete<T>(data: T, status: number = 200): void {
    vi.mocked(axios.delete).mockResolvedValue({ data, status });
}

/**
 * Mock an axios error response (rejected promise with status code).
 *
 * @example
 * ```ts
 * mockAxiosError("post", 401, "Unauthorized");
 * ```
 */
export function mockAxiosError(
    method: "get" | "post" | "put" | "delete",
    status: number,
    message: string = "Error"
): void {
    vi.mocked(axios[method]).mockRejectedValue({
        response: {
            status,
            data: { message },
        },
        message,
    });
}

/**
 * Mock an axios network error (no response object).
 */
export function mockAxiosNetworkError(
    method: "get" | "post" | "put" | "delete"
): void {
    vi.mocked(axios[method]).mockRejectedValue({
        message: "Network Error",
        code: "NETWORK_ERROR",
    });
}

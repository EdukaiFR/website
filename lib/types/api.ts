/**
 * Standard API error interface for axios errors
 */
export interface ApiError {
    response?: {
        data?: {
            message?: string;
            status?: string;
        };
        status?: number;
        statusText?: string;
    };
    message?: string;
}

/**
 * Standard API response with status (legacy - use ApiResult for new code)
 */
export interface ApiResponse<T = unknown> {
    status: "success" | "failure";
    message: string;
    data?: T;
}

/**
 * Standard error response from API
 */
export interface ApiErrorResponse {
    status: "failure";
    message: string;
}

// ============================================================================
// New standardized API result types
// ============================================================================

/**
 * Successful API response with typed data
 *
 * @template T - The type of data returned on success
 */
export interface ApiSuccessResult<T> {
    status: "success";
    message: string;
    data: T;
}

/**
 * Failed API response
 */
export interface ApiFailureResult {
    status: "failure";
    message: string;
    error?: string;
    statusCode?: number;
}

/**
 * Union type for API results - use this for all new service methods
 *
 * @template T - The type of data returned on success
 *
 * @example
 * ```typescript
 * // In service
 * const getUser = async (id: string): Promise<ApiResult<User>> => {
 *     try {
 *         const response = await axios.get(`/users/${id}`);
 *         return { status: "success", message: "User found", data: response.data };
 *     } catch (error) {
 *         return { status: "failure", message: "User not found" };
 *     }
 * };
 *
 * // In component
 * const result = await getUser(id);
 * if (result.status === "success") {
 *     // TypeScript knows result.data exists and is of type User
 *     console.log(result.data.name);
 * } else {
 *     // TypeScript knows this is a failure
 *     toast.error(result.message);
 * }
 * ```
 */
export type ApiResult<T> = ApiSuccessResult<T> | ApiFailureResult;

/**
 * Type guard to check if an API result is successful
 *
 * @param result - The API result to check
 * @returns true if the result is successful, narrowing the type
 */
export function isApiSuccess<T>(
    result: ApiResult<T>
): result is ApiSuccessResult<T> {
    return result.status === "success";
}

/**
 * Type guard to check if an API result is a failure
 *
 * @param result - The API result to check
 * @returns true if the result is a failure, narrowing the type
 */
export function isApiFailure<T>(
    result: ApiResult<T>
): result is ApiFailureResult {
    return result.status === "failure";
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        ("response" in error || "message" in error)
    );
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        return (
            error.response?.data?.message ||
            error.message ||
            "Une erreur inconnue est survenue"
        );
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Une erreur inconnue est survenue";
}

/**
 * Create a success result
 *
 * @param data - The data to include in the result
 * @param message - Optional message (defaults to "Success")
 */
export function successResult<T>(
    data: T,
    message: string = "Success"
): ApiSuccessResult<T> {
    return { status: "success", message, data };
}

/**
 * Create a failure result
 *
 * @param message - The error message
 * @param error - Optional error details
 */
export function failureResult(
    message: string,
    error?: string
): ApiFailureResult {
    return { status: "failure", message, error };
}

/**
 * Convert an API error to a failure result
 *
 * @param error - The error to convert
 * @param defaultMessage - Default message if error message is not available
 */
export function errorToFailureResult(
    error: unknown,
    defaultMessage: string = "Une erreur est survenue"
): ApiFailureResult {
    const statusCode = (error as { response?: { status?: number } })?.response?.status;
    return {
        ...failureResult(getErrorMessage(error) || defaultMessage),
        statusCode,
    };
}

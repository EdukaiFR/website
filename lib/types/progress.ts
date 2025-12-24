/**
 * Types for Server-Sent Events (SSE) course generation progress tracking
 */

/**
 * Represents a step in the course generation process
 */
export type ProgressStep =
    | "files_uploaded"
    | "quiz_generating"
    | "quiz_generated"
    | "sheet_generating"
    | "sheet_generated"
    | "linking_resources"
    | "completed"
    | "error";

/**
 * Progress event sent via SSE from the backend
 */
export interface ProgressEvent {
    /** Current step in the generation process */
    step: ProgressStep;
    /** Human-readable message describing current operation */
    message: string;
    /** Progress percentage (0-100) */
    progress: number;
    /** Optional additional data about the generation */
    data?: ProgressEventData;
    /** ISO timestamp of the event */
    timestamp: string;
}

/**
 * Optional data included in progress events
 */
export interface ProgressEventData {
    /** IDs of uploaded files */
    fileIds?: string[];
    /** ID of generated quiz */
    quizId?: string;
    /** ID of generated summary sheet */
    sheetId?: string;
    /** Error message if step === 'error' */
    error?: string;
}

/**
 * Return type for useGenerationProgress hook
 */
export interface UseGenerationProgressReturn {
    /** Current progress percentage (0-100) */
    progress: number;
    /** Human-readable status message */
    message: string;
    /** Current generation step */
    step: ProgressStep | "";
    /** Whether generation is complete */
    isComplete: boolean;
    /** Error message if an error occurred */
    error: string | null;
    /** Additional data from the progress event */
    data: ProgressEventData | null;
    /** Whether SSE connection is active */
    isConnected: boolean;
}

/**
 * Configuration for the useGenerationProgress hook
 */
export interface UseGenerationProgressConfig {
    /** Job ID to track progress for */
    jobId: string | null;
    /** Callback when generation completes successfully */
    onComplete?: (data: ProgressEventData | null) => void;
    /** Callback when an error occurs */
    onError?: (error: string) => void;
    /** Callback for each progress update */
    onProgress?: (event: ProgressEvent) => void;
}

/**
 * Response from starting a generation job
 */
export interface StartGenerationResponse {
    /** Unique job identifier for tracking progress */
    jobId: string;
    /** Success message */
    message: string;
    /** Status of the request */
    status: "success" | "failure";
}

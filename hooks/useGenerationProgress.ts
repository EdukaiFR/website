"use client";

import type {
    ProgressEvent,
    ProgressEventData,
    ProgressStep,
    UseGenerationProgressConfig,
    UseGenerationProgressReturn,
} from "@/lib/types/progress";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage SSE connection for real-time course generation progress
 *
 * This hook establishes a Server-Sent Events connection to track the progress
 * of course generation. It handles connection lifecycle, error recovery, and
 * provides callbacks for progress updates, completion, and errors.
 *
 * @param config - Configuration object containing jobId and callbacks
 * @returns Object containing progress state and connection status
 *
 * @example
 * ```tsx
 * const { progress, message, isComplete, error } = useGenerationProgress({
 *   jobId: generationJobId,
 *   onComplete: (data) => console.log('Generation completed!', data),
 *   onError: (error) => console.error('Generation failed:', error)
 * });
 * ```
 */
export function useGenerationProgress(
    config: UseGenerationProgressConfig
): UseGenerationProgressReturn {
    const { jobId, onComplete, onError, onProgress } = config;

    // State management
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [step, setStep] = useState<ProgressStep | "">("");
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProgressEventData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Refs for SSE connection and stable callback references
    const eventSourceRef = useRef<EventSource | null>(null);

    // Store callbacks in refs to avoid triggering effect re-runs
    // This is the key fix: callbacks can change without causing reconnections
    const callbacksRef = useRef({
        onComplete,
        onError,
        onProgress,
    });

    // Update callback refs when they change (without triggering reconnection)
    useEffect(() => {
        callbacksRef.current = { onComplete, onError, onProgress };
    }, [onComplete, onError, onProgress]);

    /**
     * Clean up SSE connection
     * Stable reference - only depends on nothing (empty deps)
     */
    const cleanup = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsConnected(false);
        }
    }, []);

    /**
     * Establish SSE connection when jobId changes
     * This effect only runs when jobId changes, not when callbacks change
     */
    useEffect(() => {
        // Don't connect if no jobId
        if (!jobId) {
            cleanup();
            return;
        }

        // Clean up previous connection
        cleanup();

        // Reset state for new job
        setProgress(0);
        setMessage("");
        setStep("");
        setIsComplete(false);
        setError(null);
        setData(null);

        /**
         * Handle progress event from SSE
         * Defined inside effect to access current callbacksRef
         */
        const handleProgressEvent = (event: MessageEvent) => {
            try {
                const progressEvent: ProgressEvent = JSON.parse(event.data);

                // Update state
                setProgress(progressEvent.progress);
                setMessage(progressEvent.message);
                setStep(progressEvent.step);
                setData(progressEvent.data || null);

                // Call progress callback via ref
                callbacksRef.current.onProgress?.(progressEvent);

                // Handle completion
                if (progressEvent.step === "completed") {
                    setIsComplete(true);
                    cleanup();
                    callbacksRef.current.onComplete?.(progressEvent.data || null);
                }
                // Handle error from server
                else if (progressEvent.step === "error") {
                    const errorMessage =
                        progressEvent.data?.error || "Une erreur est survenue";
                    setError(errorMessage);
                    cleanup();
                    callbacksRef.current.onError?.(errorMessage);
                }
            } catch (err) {
                const parseError = "Erreur lors du parsing de l'événement SSE";
                if (process.env.NODE_ENV === "development") {
                    console.error(parseError, err);
                }
                setError(parseError);
                cleanup();
                callbacksRef.current.onError?.(parseError);
            }
        };

        /**
         * Handle SSE connection error
         */
        const handleError = () => {
            const connectionError = "Erreur de connexion au serveur";
            if (process.env.NODE_ENV === "development") {
                console.error(connectionError);
            }
            setError(connectionError);
            cleanup();
            callbacksRef.current.onError?.(connectionError);
        };

        try {
            // Create new SSE connection
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const eventSource = new EventSource(
                `${apiUrl}/progress/${jobId}`,
                { withCredentials: true }
            );

            eventSourceRef.current = eventSource;

            // Set up event listeners
            eventSource.addEventListener("progress", handleProgressEvent);
            eventSource.onerror = handleError;

            // Mark as connected when open
            eventSource.onopen = () => {
                setIsConnected(true);
            };
        } catch (err) {
            const initError = "Impossible de se connecter au serveur";
            if (process.env.NODE_ENV === "development") {
                console.error(initError, err);
            }
            setError(initError);
            callbacksRef.current.onError?.(initError);
        }

        // Cleanup on unmount or jobId change
        return cleanup;
    }, [jobId, cleanup]); // Only jobId and cleanup in deps - callbacks are accessed via refs

    return {
        progress,
        message,
        step,
        isComplete,
        error,
        data,
        isConnected,
    };
}

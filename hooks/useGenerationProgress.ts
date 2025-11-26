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

    // Refs to avoid stale closures
    const eventSourceRef = useRef<EventSource | null>(null);
    const onCompleteRef = useRef(onComplete);
    const onErrorRef = useRef(onError);
    const onProgressRef = useRef(onProgress);

    // Update refs when callbacks change (without triggering re-connection)
    useEffect(() => {
        onCompleteRef.current = onComplete;
        onErrorRef.current = onError;
        onProgressRef.current = onProgress;
    }, [onComplete, onError, onProgress]);

    /**
     * Clean up SSE connection
     */
    const cleanup = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsConnected(false);
        }
    }, []);

    /**
     * Handle progress event from SSE
     */
    const handleProgressEvent = useCallback((event: MessageEvent) => {
        try {
            const progressEvent: ProgressEvent = JSON.parse(event.data);

            // Update state
            setProgress(progressEvent.progress);
            setMessage(progressEvent.message);
            setStep(progressEvent.step);
            setData(progressEvent.data || null);

            // Call progress callback
            onProgressRef.current?.(progressEvent);

            // Handle completion
            if (progressEvent.step === "completed") {
                setIsComplete(true);
                cleanup();
                onCompleteRef.current?.(progressEvent.data || null);
            }
            // Handle error
            else if (progressEvent.step === "error") {
                const errorMessage =
                    progressEvent.data?.error || "Une erreur est survenue";
                setError(errorMessage);
                cleanup();
                onErrorRef.current?.(errorMessage);
            }
        } catch (err) {
            const parseError = "Erreur lors du parsing de l'événement SSE";
            console.error(parseError, err);
            setError(parseError);
            cleanup();
            onErrorRef.current?.(parseError);
        }
    }, [cleanup]);

    /**
     * Handle SSE connection error
     */
    const handleError = useCallback(() => {
        const connectionError = "Erreur de connexion au serveur";
        console.error(connectionError);
        setError(connectionError);
        cleanup();
        onErrorRef.current?.(connectionError);
    }, [cleanup]);

    /**
     * Establish SSE connection when jobId changes
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
            console.error(initError, err);
            setError(initError);
            onErrorRef.current?.(initError);
        }

        // Cleanup on unmount or jobId change
        return cleanup;
    }, [jobId, cleanup, handleProgressEvent, handleError]);

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

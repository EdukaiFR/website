import { renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGenerationProgress } from "@/hooks/useGenerationProgress";

// Store EventSource instances for testing
let eventSourceInstances: MockEventSource[] = [];

// Mock EventSource class
class MockEventSource {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSED = 2;

    url: string;
    withCredentials: boolean;
    readyState: number = MockEventSource.CONNECTING;
    onopen: ((event: Event) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;

    private listeners: Map<string, ((event: MessageEvent) => void)[]> = new Map();

    constructor(url: string, options?: { withCredentials?: boolean }) {
        this.url = url;
        this.withCredentials = options?.withCredentials ?? false;
        eventSourceInstances.push(this);
    }

    addEventListener(type: string, listener: (event: MessageEvent) => void): void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)!.push(listener);
    }

    removeEventListener(type: string, listener: (event: MessageEvent) => void): void {
        const listeners = this.listeners.get(type);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    close(): void {
        this.readyState = MockEventSource.CLOSED;
    }

    // Helper methods for testing
    simulateOpen(): void {
        this.readyState = MockEventSource.OPEN;
        this.onopen?.(new Event("open"));
    }

    simulateError(): void {
        this.onerror?.(new Event("error"));
    }

    simulateProgressEvent(data: unknown): void {
        const event = new MessageEvent("progress", { data: JSON.stringify(data) });
        const listeners = this.listeners.get("progress");
        if (listeners) {
            listeners.forEach(listener => listener(event));
        }
    }
}

// Override global EventSource
vi.stubGlobal("EventSource", MockEventSource);

describe("useGenerationProgress", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        eventSourceInstances = [];
        vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000/api");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        eventSourceInstances.forEach(es => es.close());
        eventSourceInstances = [];
    });

    describe("initial state", () => {
        it("should return initial state when no jobId is provided", () => {
            const { result } = renderHook(() =>
                useGenerationProgress({ jobId: null })
            );

            expect(result.current.progress).toBe(0);
            expect(result.current.message).toBe("");
            expect(result.current.step).toBe("");
            expect(result.current.isComplete).toBe(false);
            expect(result.current.error).toBe(null);
            expect(result.current.data).toBe(null);
            expect(result.current.isConnected).toBe(false);
        });

        it("should not create EventSource when jobId is null", () => {
            renderHook(() => useGenerationProgress({ jobId: null }));

            expect(eventSourceInstances.length).toBe(0);
        });
    });

    describe("SSE connection", () => {
        it("should create EventSource with correct URL when jobId is provided", () => {
            renderHook(() =>
                useGenerationProgress({ jobId: "test-job-123" })
            );

            expect(eventSourceInstances.length).toBe(1);
            expect(eventSourceInstances[0].url).toBe(
                "http://localhost:3000/api/progress/test-job-123"
            );
            expect(eventSourceInstances[0].withCredentials).toBe(true);
        });

        it("should set isConnected to true when connection opens", async () => {
            const { result } = renderHook(() =>
                useGenerationProgress({ jobId: "test-job-123" })
            );

            act(() => {
                eventSourceInstances[0].simulateOpen();
            });

            await waitFor(() => {
                expect(result.current.isConnected).toBe(true);
            });
        });

        it("should close previous connection when jobId changes", () => {
            const { rerender } = renderHook(
                ({ jobId }) => useGenerationProgress({ jobId }),
                { initialProps: { jobId: "job-1" } }
            );

            expect(eventSourceInstances.length).toBe(1);
            const firstInstance = eventSourceInstances[0];

            rerender({ jobId: "job-2" });

            expect(firstInstance.readyState).toBe(MockEventSource.CLOSED);
            expect(eventSourceInstances.length).toBe(2);
            expect(eventSourceInstances[1].url).toContain("job-2");
        });
    });

    describe("progress events", () => {
        it("should update progress state on progress event", async () => {
            const { result } = renderHook(() =>
                useGenerationProgress({ jobId: "test-job" })
            );

            act(() => {
                eventSourceInstances[0].simulateProgressEvent({
                    progress: 50,
                    message: "Processing...",
                    step: "processing",
                });
            });

            await waitFor(() => {
                expect(result.current.progress).toBe(50);
                expect(result.current.message).toBe("Processing...");
                expect(result.current.step).toBe("processing");
            });
        });

        it("should call onProgress callback on progress event", async () => {
            const onProgress = vi.fn();

            renderHook(() =>
                useGenerationProgress({
                    jobId: "test-job",
                    onProgress,
                })
            );

            act(() => {
                eventSourceInstances[0].simulateProgressEvent({
                    progress: 25,
                    message: "Starting...",
                    step: "started",
                });
            });

            await waitFor(() => {
                expect(onProgress).toHaveBeenCalledWith({
                    progress: 25,
                    message: "Starting...",
                    step: "started",
                });
            });
        });

        it("should set isComplete and call onComplete when step is completed", async () => {
            const onComplete = vi.fn();

            const { result } = renderHook(() =>
                useGenerationProgress({
                    jobId: "test-job",
                    onComplete,
                })
            );

            act(() => {
                eventSourceInstances[0].simulateProgressEvent({
                    progress: 100,
                    message: "Done!",
                    step: "completed",
                    data: { quizId: "quiz-123", sheetId: "sheet-456" },
                });
            });

            await waitFor(() => {
                expect(result.current.isComplete).toBe(true);
                expect(result.current.progress).toBe(100);
                expect(onComplete).toHaveBeenCalledWith({
                    quizId: "quiz-123",
                    sheetId: "sheet-456",
                });
            });
        });

        it("should close connection when completed", async () => {
            renderHook(() =>
                useGenerationProgress({ jobId: "test-job" })
            );

            act(() => {
                eventSourceInstances[0].simulateProgressEvent({
                    progress: 100,
                    message: "Done!",
                    step: "completed",
                });
            });

            await waitFor(() => {
                expect(eventSourceInstances[0].readyState).toBe(MockEventSource.CLOSED);
            });
        });
    });

    describe("error handling", () => {
        it("should set error and call onError when step is error", async () => {
            const onError = vi.fn();

            const { result } = renderHook(() =>
                useGenerationProgress({
                    jobId: "test-job",
                    onError,
                })
            );

            act(() => {
                eventSourceInstances[0].simulateProgressEvent({
                    progress: 30,
                    message: "Error occurred",
                    step: "error",
                    data: { error: "Generation failed" },
                });
            });

            await waitFor(() => {
                expect(result.current.error).toBe("Generation failed");
                expect(onError).toHaveBeenCalledWith("Generation failed");
            });
        });

        it("should handle connection error", async () => {
            const onError = vi.fn();

            const { result } = renderHook(() =>
                useGenerationProgress({
                    jobId: "test-job",
                    onError,
                })
            );

            act(() => {
                eventSourceInstances[0].simulateError();
            });

            await waitFor(() => {
                expect(result.current.error).toBe("Erreur de connexion au serveur");
                expect(onError).toHaveBeenCalledWith("Erreur de connexion au serveur");
            });
        });

        it("should handle invalid JSON in progress event", async () => {
            const onError = vi.fn();

            const { result } = renderHook(() =>
                useGenerationProgress({
                    jobId: "test-job",
                    onError,
                })
            );

            // Simulate an event with invalid JSON
            act(() => {
                const listeners = (eventSourceInstances[0] as MockEventSource)["listeners"].get("progress");
                if (listeners) {
                    const invalidEvent = new MessageEvent("progress", { data: "invalid-json" });
                    listeners.forEach(listener => listener(invalidEvent));
                }
            });

            await waitFor(() => {
                expect(result.current.error).toBe("Erreur lors du parsing de l'événement SSE");
                expect(onError).toHaveBeenCalled();
            });
        });
    });

    describe("cleanup", () => {
        it("should close connection on unmount", () => {
            const { unmount } = renderHook(() =>
                useGenerationProgress({ jobId: "test-job" })
            );

            expect(eventSourceInstances[0].readyState).toBe(MockEventSource.CONNECTING);

            unmount();

            expect(eventSourceInstances[0].readyState).toBe(MockEventSource.CLOSED);
        });

        it("should close connection when jobId becomes null", () => {
            const { rerender } = renderHook(
                ({ jobId }) => useGenerationProgress({ jobId }),
                { initialProps: { jobId: "test-job" as string | null } }
            );

            expect(eventSourceInstances.length).toBe(1);

            rerender({ jobId: null });

            expect(eventSourceInstances[0].readyState).toBe(MockEventSource.CLOSED);
        });
    });

    describe("callback stability", () => {
        it("should not reconnect when callbacks change", () => {
            const onProgress1 = vi.fn();
            const onProgress2 = vi.fn();

            const { rerender } = renderHook(
                ({ onProgress }) => useGenerationProgress({ jobId: "test-job", onProgress }),
                { initialProps: { onProgress: onProgress1 } }
            );

            expect(eventSourceInstances.length).toBe(1);

            // Change callback - should NOT create new connection
            rerender({ onProgress: onProgress2 });

            // Still only one instance - no reconnection
            expect(eventSourceInstances.length).toBe(1);
        });

        it("should use latest callback even after rerender", async () => {
            const onProgress1 = vi.fn();
            const onProgress2 = vi.fn();

            const { rerender } = renderHook(
                ({ onProgress }) => useGenerationProgress({ jobId: "test-job", onProgress }),
                { initialProps: { onProgress: onProgress1 } }
            );

            rerender({ onProgress: onProgress2 });

            act(() => {
                eventSourceInstances[0].simulateProgressEvent({
                    progress: 50,
                    message: "Test",
                    step: "processing",
                });
            });

            await waitFor(() => {
                // The new callback should be called, not the old one
                expect(onProgress2).toHaveBeenCalled();
                expect(onProgress1).not.toHaveBeenCalled();
            });
        });
    });
});

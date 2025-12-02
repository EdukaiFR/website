import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000/api");
vi.stubEnv("NODE_ENV", "test");

// Mock window.location
Object.defineProperty(window, "location", {
    value: {
        href: "",
        assign: vi.fn(),
        replace: vi.fn(),
    },
    writable: true,
});

// Mock EventSource for SSE tests
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

    dispatchEvent(event: Event): boolean {
        const listeners = this.listeners.get(event.type);
        if (listeners) {
            listeners.forEach(listener => listener(event as MessageEvent));
        }
        return true;
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

    simulateMessage(type: string, data: unknown): void {
        const event = new MessageEvent(type, { data: JSON.stringify(data) });
        const listeners = this.listeners.get(type);
        if (listeners) {
            listeners.forEach(listener => listener(event));
        }
    }
}

vi.stubGlobal("EventSource", MockEventSource);

// Export for use in tests
export { MockEventSource };

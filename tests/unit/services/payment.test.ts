import { PaymentError, usePaymentService } from "@/services/payment";
import axios from "axios";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    type Mock,
} from "vitest";

// Mock axios
vi.mock("axios", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        isAxiosError: vi.fn(),
    },
}));

// Mock auth-utils
vi.mock("@/lib/auth-utils", () => ({
    syncAuthCookie: vi.fn(),
}));

// Get mocked post function
const mockedPost = axios.post as Mock;

describe("PaymentService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000/api");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    describe("usePaymentService", () => {
        it("should return payment service methods", () => {
            const service = usePaymentService();

            expect(service).toHaveProperty("createCheckoutSession");
            expect(service).toHaveProperty("createPortalSession");
            expect(typeof service.createCheckoutSession).toBe("function");
            expect(typeof service.createPortalSession).toBe("function");
        });
    });

    describe("createCheckoutSession", () => {
        it("should return checkout URL on success", async () => {
            const mockResponse = {
                data: {
                    url: "https://checkout.stripe.com/session123",
                    sessionId: "session_123",
                },
            };
            mockedPost.mockResolvedValueOnce(mockResponse);

            const service = usePaymentService();
            const response = await service.createCheckoutSession();

            expect(response.url).toBe("https://checkout.stripe.com/session123");
            expect(response.sessionId).toBe("session_123");
            expect(mockedPost).toHaveBeenCalledWith(
                "http://localhost:3000/api/payment/checkout",
                {},
                { withCredentials: true }
            );
        });

        it("should throw PaymentError with CHECKOUT_FAILED on API error", async () => {
            mockedPost.mockRejectedValueOnce({
                response: {
                    status: 500,
                    statusText: "Internal Server Error",
                    data: { message: "Server error" },
                },
            });

            const service = usePaymentService();

            await expect(service.createCheckoutSession()).rejects.toThrow(
                PaymentError
            );

            mockedPost.mockRejectedValueOnce({
                response: {
                    status: 500,
                    statusText: "Internal Server Error",
                    data: { message: "Server error" },
                },
            });

            try {
                await service.createCheckoutSession();
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError);
                const paymentError = error as PaymentError;
                expect(paymentError.code).toBe("CHECKOUT_FAILED");
                expect(paymentError.message).toBe(
                    "Impossible de créer la session de paiement. Veuillez réessayer."
                );
            }
        });

        it("should throw PaymentError with UNAUTHORIZED on 401", async () => {
            mockedPost.mockRejectedValueOnce({
                response: {
                    status: 401,
                    statusText: "Unauthorized",
                    data: { message: "Not authenticated" },
                },
            });

            const service = usePaymentService();

            try {
                await service.createCheckoutSession();
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError);
                const paymentError = error as PaymentError;
                expect(paymentError.code).toBe("UNAUTHORIZED");
                expect(paymentError.statusCode).toBe(401);
            }
        });

        it("should throw PaymentError with UNAUTHORIZED on 403", async () => {
            mockedPost.mockRejectedValueOnce({
                response: {
                    status: 403,
                    statusText: "Forbidden",
                    data: { message: "Access denied" },
                },
            });

            const service = usePaymentService();

            try {
                await service.createCheckoutSession();
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError);
                const paymentError = error as PaymentError;
                expect(paymentError.code).toBe("UNAUTHORIZED");
            }
        });

        it("should throw PaymentError with NETWORK_ERROR on network failure", async () => {
            mockedPost.mockRejectedValueOnce({
                message: "Network Error",
                // No response property = network error
            });

            const service = usePaymentService();

            try {
                await service.createCheckoutSession();
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError);
                const paymentError = error as PaymentError;
                expect(paymentError.code).toBe("NETWORK_ERROR");
                expect(paymentError.message).toBe(
                    "Erreur de connexion. Vérifiez votre connexion internet."
                );
            }
        });
    });

    describe("createPortalSession", () => {
        it("should return portal URL on success", async () => {
            const mockResponse = {
                data: {
                    url: "https://billing.stripe.com/portal123",
                },
            };
            mockedPost.mockResolvedValueOnce(mockResponse);

            const service = usePaymentService();
            const response = await service.createPortalSession();

            expect(response.url).toBe("https://billing.stripe.com/portal123");
            expect(mockedPost).toHaveBeenCalledWith(
                "http://localhost:3000/api/payment/portal",
                {},
                { withCredentials: true }
            );
        });

        it("should throw PaymentError with PORTAL_FAILED on API error", async () => {
            mockedPost.mockRejectedValueOnce({
                response: {
                    status: 500,
                    statusText: "Internal Server Error",
                    data: { message: "Server error" },
                },
            });

            const service = usePaymentService();

            try {
                await service.createPortalSession();
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError);
                const paymentError = error as PaymentError;
                expect(paymentError.code).toBe("PORTAL_FAILED");
                expect(paymentError.message).toBe(
                    "Impossible d'accéder au portail de gestion. Veuillez réessayer."
                );
            }
        });

        it("should throw PaymentError with UNAUTHORIZED on 401", async () => {
            mockedPost.mockRejectedValueOnce({
                response: {
                    status: 401,
                    statusText: "Unauthorized",
                },
            });

            const service = usePaymentService();

            try {
                await service.createPortalSession();
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError);
                const paymentError = error as PaymentError;
                expect(paymentError.code).toBe("UNAUTHORIZED");
            }
        });
    });

    describe("PaymentError", () => {
        it("should create error with correct properties", () => {
            const error = new PaymentError("CHECKOUT_FAILED", 500);

            expect(error.name).toBe("PaymentError");
            expect(error.code).toBe("CHECKOUT_FAILED");
            expect(error.statusCode).toBe(500);
            expect(error.message).toBe(
                "Impossible de créer la session de paiement. Veuillez réessayer."
            );
        });

        it("should be instanceof Error", () => {
            const error = new PaymentError("NETWORK_ERROR");

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(PaymentError);
        });

        it("should have all error codes with messages", () => {
            const codes = [
                "CHECKOUT_FAILED",
                "PORTAL_FAILED",
                "UNAUTHORIZED",
                "NETWORK_ERROR",
            ] as const;

            codes.forEach(code => {
                const error = new PaymentError(code);
                expect(error.message).toBeTruthy();
                expect(typeof error.message).toBe("string");
            });
        });
    });
});

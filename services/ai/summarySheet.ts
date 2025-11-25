import { ApiError, ApiErrorResponse } from "@/lib/types/api";
import { Visibility } from "@/lib/types/visibility";
import axios from "axios";

// Response interfaces
export interface GeneratedSheetResponse {
    id: string;
    title: string;
    content: string;
    message: string;
}

export interface SheetByIdResponse {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface DeleteSheetResponse {
    status: "success" | "failure";
    message: string;
}

export interface SheetVisibilityUpdateResponse {
    status: "success" | "failure";
    message: string;
}

export interface PublicSheet {
    _id: string;
    title: string;
    content: string;
    visibility: Visibility;
    createdAt: string;
}

export interface PublicSheetsResponse {
    status: "success" | "failure";
    sheets?: PublicSheet[];
    message?: string;
}

export interface SummarySheetService {
    generateSheet: (recognizedText: string[]) => Promise<GeneratedSheetResponse | undefined>;
    getSheetById: (sheetId: string) => Promise<SheetByIdResponse | undefined>;
    deleteSheetById: (sheetId: string) => Promise<DeleteSheetResponse | ApiErrorResponse>;
    updateVisibility: (sheetId: string, visibility: Visibility) => Promise<SheetVisibilityUpdateResponse | ApiErrorResponse>;
    getPublicSheets: () => Promise<PublicSheetsResponse | ApiErrorResponse>;
}

export function useSummarySheetService(): SummarySheetService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const generateSheet = async (recognizedText: string[]) => {
        try {
            const textString = recognizedText.join("\n");

            const response = await axios.post(
                `${apiUrl}/ai/generate-sheet`,
                { textString },
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            console.error(
                "An error ocurred generating the summary sheet",
                error
            );
        }
    };

    const getSheetById = async (sheetId: string) => {
        try {
            const response = await axios.get(
                `${apiUrl}/summary-sheets/${sheetId}`,
                {
                    withCredentials: true,
                }
            );

            return response.data;
        } catch (error) {
            console.error(
                `An error ocurred getting the summary sheet ${sheetId}`,
                error
            );
        }
    };

    const deleteSheetById = async (sheetId: string): Promise<DeleteSheetResponse | ApiErrorResponse> => {
        try {
            const response = await axios.delete(
                `${apiUrl}/summary-sheets/${sheetId}`,
                { withCredentials: true }
            );

            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            if (err?.response?.data) {
                return err.response.data as ApiErrorResponse;
            }

            return {
                status: "failure",
                message: "Une erreur inconnue est survenue lors de la requête.",
            };
        }
    };

    // Unused for now (may be useful in the future if we decide to share a
    // summary sheet but not its course, or the other way around)
    const updateVisibility = async (
        sheetId: string,
        visibility: Visibility
    ): Promise<SheetVisibilityUpdateResponse | ApiErrorResponse> => {
        try {
            const response = await axios.patch(
                `${apiUrl}/summary-sheets/${sheetId}/visibility`,
                { visibility: visibility },
                { withCredentials: true }
            );

            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            if (err?.response?.data) {
                return err.response.data as ApiErrorResponse;
            }

            return {
                status: "failure",
                message: "Une erreur est survenue lors du partage de la fiche.",
            };
        }
    };

    const getPublicSheets = async (): Promise<PublicSheetsResponse | ApiErrorResponse> => {
        try {
            const response = await axios.get(`${apiUrl}/summary-sheets/public`);

            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            if (err?.response?.data) {
                return err.response.data as ApiErrorResponse;
            }

            return {
                status: "failure",
                message:
                    "Une erreur est survenue lors de la récupération des fiches publiques.",
            };
        }
    };

    return {
        generateSheet,
        getSheetById,
        deleteSheetById,
        updateVisibility,
        getPublicSheets,
    };
}

import axios from "axios";

export interface SummarySheetService {
    generateSheet: (recognizedText: string[]) => Promise<any>;
    getSheetById: (sheetId: string) => Promise<any>;
    deleteSheetById: (sheetId: string) => Promise<any>;
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

    const deleteSheetById = async (sheetId: string) => {
        try {
            const response = await axios.delete(
                `${apiUrl}/summary-sheets/${sheetId}`,
                { withCredentials: true }
            );

            return response.data;
        } catch (error: any) {
            if (error?.response?.data) {
                return error.response.data;
            }

            return {
                status: "failure",
                message: "Une erreur inconnue est survenue lors de la requête.",
            };
        }
    };

    return { generateSheet, getSheetById, deleteSheetById };
}

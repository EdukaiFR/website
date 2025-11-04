import type { SummarySheetService, BlobService } from "@/services";
import type { SummarySheetData } from "@/lib/types/library";
import { useState } from "react";

interface SummarySheet {
    textString: string;
}

export function useSheet(summarySheetService: SummarySheetService) {
    const [sheetData, setSheetData] = useState<SummarySheet>();
    const [sheetId, setSheetId] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSheet = async (recognizedTexts: string[]) => {
        setIsGenerating(true);
        setError(null);

        try {
            const sheet =
                await summarySheetService.generateSheet(recognizedTexts);
            const newSheetId = sheet.id;

            setSheetId(newSheetId);

            return { success: true, newSheetId };
        } catch (error) {
            console.error("Error generating summary sheet: ", error);
            setError("Failed to generate summary sheet. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const deleteSheetById = async (sheetId: string) => {
        try {
            const response = await summarySheetService.deleteSheetById(sheetId);
            return response;
        } catch (error) {
            console.error("Error deleting summary sheet: ", error);
            setError("Failed to delete summary sheet. Please try again.");
            return { status: "failure", message: error };
        }
    };

    return {
        sheetId,
        error,
        sheetData,
        generateSheet,
        deleteSheetById,
    };
}

import type { SummarySheetService, BlobService } from "@/services";
import { useState } from "react";
import testData from "../json/testData/quizResponse.json";

const tempData = testData; // Temporary test data for the quiz

interface SummarySheet {
  textString: string
}

export function useSheet(
  summarySheetService: SummarySheetService,
  blobService: BlobService,
) {
  const [sheetData, setSheetData] = useState<SummarySheet>();
  const [sheetId, setSheetId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSheet = async (recognizedTexts: string[]) => {
    setIsGenerating(true);
    setError(null);

    try {
      const sheet = await summarySheetService.generateSheet(recognizedTexts);
      const newSheetId = sheet.id;

      setSheetId(newSheetId);

      return { success: true, newSheetId };

    } catch (error) {
        console.error("Error generating summary sheet: ", error);
        setError("Failed to generate summary sheet. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  // const loadSheet = async (sheetId: string) => {
  //   try {
  //     const sheetResponse = await blobService.getFileById(sheetId);
  //     setSheetData(sheetResponse.item);

  //     return sheetResponse.item;

  //   } catch (error) {
  //       console.error(`Error getting summary sheet file ${sheetId} `, error);
  //       setError("Failed to load summary sheet file. Please try again.");
  //     return null;
  //   }
  // };


  return {
    sheetId,
    error,
    sheetData,
    generateSheet
    // loadSheet,
  };
}

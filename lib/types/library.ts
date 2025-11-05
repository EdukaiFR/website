import type { VisibilityType } from "./visibility";

// Base interface for common fields
interface BaseSummarySheet {
    _id: string;
    author: string;
    createdAt: string;
    type: "ai-generated" | "user-uploaded";
    source: "ai" | "file";
}

// AI-generated summary sheet
interface AISummarySheet extends BaseSummarySheet {
    type: "ai-generated";
    source: "ai";
    content: string;
    title?: string;
    visibility: VisibilityType;
    isOwner?: boolean;
}

// User-uploaded file
interface UploadedFileSummarySheet extends BaseSummarySheet {
    type: "user-uploaded";
    source: "file";
    name: string;
    contentType: string;
    fileType: string;
    size?: number;
}

// Union type for both kinds of summary sheets
export type SummarySheetData = AISummarySheet | UploadedFileSummarySheet;

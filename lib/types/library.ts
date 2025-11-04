import type { VisibilityType } from "./visibility";

export interface SummarySheetData {
    _id: string;
    title?: string;
    author: string;
    content: string;
    createdAt: string;
    visibility: VisibilityType;
    isOwner?: boolean;
}

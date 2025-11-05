"use client";

import { SummarySheetData } from "@/lib/types/library";
import { FileText, FileIcon, Image as ImageIcon } from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { PDFPreview } from "./PDFPreview";

export type SummarySheetCardProps = {
    summary_sheet: SummarySheetData;
};

export const SummarySheetCard = ({ summary_sheet }: SummarySheetCardProps) => {
    const [htmlContent, setHtmlContent] = useState("");
    const isUploadedFile = summary_sheet.source === "file";

    useEffect(() => {
        // Only render markdown for AI-generated sheets
        if (!isUploadedFile && "content" in summary_sheet) {
            const renderMarkdown = async () => {
                // Get first 400 characters of content for preview
                const previewContent = summary_sheet.content.substring(0, 400);
                const html = await marked.parse(previewContent);
                setHtmlContent(html);
            };
            renderMarkdown();
        }
    }, [summary_sheet, isUploadedFile]);

    // Get file extension for uploaded files
    const getFileExtension = () => {
        if (isUploadedFile && "name" in summary_sheet) {
            const parts = summary_sheet.name.split(".");
            return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
        }
        return "";
    };

    // Get appropriate title
    const getTitle = () => {
        if (isUploadedFile && "name" in summary_sheet) {
            return summary_sheet.name;
        }
        if (!isUploadedFile && "title" in summary_sheet) {
            return summary_sheet.title || "Fiche de révision";
        }
        return "Fiche de révision";
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-full h-full bg-white rounded-lg shadow-lg border border-[#E3E3E7] overflow-hidden flex flex-col">
                {/* Header with icon */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs font-semibold text-gray-700 truncate">
                        {getTitle()}
                    </p>
                </div>

                {/* Content preview */}
                <div className="flex-1 overflow-hidden p-6">
                    {isUploadedFile ? (
                        // Preview for uploaded files
                        (() => {
                            const contentType = "contentType" in summary_sheet ? summary_sheet.contentType : "";
                            const fileName = "name" in summary_sheet ? summary_sheet.name : "";

                            // PDF preview
                            if (contentType === "application/pdf") {
                                return (
                                    <PDFPreview
                                        fileId={summary_sheet._id}
                                        fileName={fileName}
                                        contentType={contentType}
                                    />
                                );
                            }

                            // Image preview
                            if (contentType.startsWith("image/")) {
                                return (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/blob/files/${summary_sheet._id}`}
                                            alt={fileName}
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                            loading="lazy"
                                        />
                                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                                            <ImageIcon className="w-3 h-3" />
                                            {getFileExtension()}
                                        </div>
                                    </div>
                                );
                            }

                            // Fallback for other file types
                            return (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <FileIcon className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-800 mb-1">
                                            {getFileExtension()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {contentType}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        // Preview for AI-generated sheets with markdown
                        <>
                            <div
                                className="prose prose-sm max-w-none text-sm leading-relaxed overflow-hidden h-full"
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                }}
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                            <div className="absolute bottom-16 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <p className="text-[10px] text-gray-400 text-center">
                        {isUploadedFile ? "Fichier uploadé" : "Aperçu de la fiche"}
                    </p>
                </div>
            </div>
        </div>
    );
};

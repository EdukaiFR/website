"use client";

import { SummarySheetData } from "@/lib/types/library";
import { FileText } from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";

export type SummarySheetCardProps = {
    summary_sheet: SummarySheetData;
};

export const SummarySheetCard = ({ summary_sheet }: SummarySheetCardProps) => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        const renderMarkdown = async () => {
            // Get first 400 characters of content for preview
            const previewContent = summary_sheet.content.substring(0, 400);
            const html = await marked.parse(previewContent);
            setHtmlContent(html);
        };
        renderMarkdown();
    }, [summary_sheet.content]);

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-full h-full bg-white rounded-lg shadow-lg border border-[#E3E3E7] overflow-hidden flex flex-col">
                {/* Header with icon */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs font-semibold text-gray-700 truncate">
                        {summary_sheet.title || "Fiche de révision"}
                    </p>
                </div>

                {/* Content preview with markdown rendering */}
                <div className="flex-1 overflow-hidden p-6">
                    <div
                        className="prose prose-sm max-w-none text-sm leading-relaxed overflow-hidden h-full"
                        style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                        }}
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                    <div className="absolute bottom-16 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <p className="text-[10px] text-gray-400 text-center">
                        Aperçu de la fiche
                    </p>
                </div>
            </div>
        </div>
    );
};

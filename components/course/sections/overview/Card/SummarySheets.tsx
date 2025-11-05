"use client";

import { CounterBadge } from "@/components/badge/CounterBadge";
import { SummarySheetCard } from "@/components/card/SummarySheetCard";
import { Button } from "@/components/ui/button";
import { SummarySheetData } from "@/lib/types/library";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    X,
} from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export type SummarySheetsProps = {
    summary_sheets: SummarySheetData[];
    courseTitle?: string;
};

export const SummarySheets = ({
    summary_sheets,
    courseTitle = "cours",
}: SummarySheetsProps) => {
    const [showSummarySheet, setShowSummarySheet] =
        useState<SummarySheetData | null>(summary_sheets?.[0] ?? null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSheetIndex, setModalSheetIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    // Update showSummarySheet when summary_sheets changes (e.g., after initial load)
    useEffect(() => {
        if (summary_sheets && summary_sheets.length > 0 && !showSummarySheet) {
            setShowSummarySheet(summary_sheets[0]);
        }
    }, [summary_sheets, showSummarySheet]);

    const getArrayForShowSummarySheetInSummarySheets = () => {
        if (!showSummarySheet || !summary_sheets) return -1;
        return summary_sheets.findIndex(
            summarySheet => summarySheet._id === showSummarySheet._id
        );
    };

    const handleOpenModal = (index: number) => {
        setModalSheetIndex(index);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleNextSheet = () => {
        if (modalSheetIndex < summary_sheets.length - 1) {
            setModalSheetIndex(modalSheetIndex + 1);
        }
    };

    const handlePrevSheet = () => {
        if (modalSheetIndex > 0) {
            setModalSheetIndex(modalSheetIndex - 1);
        }
    };

    const handleDownloadCurrentSheet = async () => {
        try {
            const currentSheet = summary_sheets[modalSheetIndex];
            if (!currentSheet) return;

            // For uploaded files, download directly
            if (currentSheet.source === "file" && "name" in currentSheet) {
                const link = document.createElement("a");
                link.href = `${process.env.NEXT_PUBLIC_API_URL}/blob/files/${currentSheet._id}`;
                link.download = currentSheet.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("Téléchargement", {
                    description: "Le fichier a été téléchargé.",
                });
                return;
            }

            // For AI-generated sheets, generate PDF from markdown
            if (currentSheet.source === "ai" && "content" in currentSheet) {
                const { generateMarkdownPdf } = await import(
                    "@/lib/summary-sheets/md2pdf"
                );

                const fileName = `${courseTitle}-fiche-resume`;
                await generateMarkdownPdf(fileName, currentSheet.content);

                toast.success("Téléchargement", {
                    description: "La fiche de révision a été téléchargée.",
                });
            }
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            toast.error("Erreur", {
                description:
                    "Une erreur s'est produite lors du téléchargement.",
            });
        }
    };

    const handleDownloadAllSheets = async () => {
        try {
            let aiSheetCount = 0;
            let uploadedFileCount = 0;

            for (let i = 0; i < summary_sheets.length; i++) {
                const sheet = summary_sheets[i];

                // Handle uploaded files
                if (sheet.source === "file" && "name" in sheet) {
                    const link = document.createElement("a");
                    link.href = `${process.env.NEXT_PUBLIC_API_URL}/blob/files/${sheet._id}`;
                    link.download = sheet.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    uploadedFileCount++;
                    // Small delay between downloads
                    await new Promise(resolve => setTimeout(resolve, 300));
                    continue;
                }

                // Handle AI-generated sheets
                if (sheet.source === "ai" && "content" in sheet) {
                    const { generateMarkdownPdf } = await import(
                        "@/lib/summary-sheets/md2pdf"
                    );

                    const fileName =
                        summary_sheets.length > 1
                            ? `${courseTitle}-fiche-resume-${i + 1}`
                            : `${courseTitle}-fiche-resume`;

                    await generateMarkdownPdf(fileName, sheet.content);
                    aiSheetCount++;
                }
            }

            const totalCount = aiSheetCount + uploadedFileCount;
            toast.success("Téléchargement", {
                description: `${totalCount} fichier(s) téléchargé(s).`,
            });
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            toast.error("Erreur", {
                description:
                    "Une erreur s'est produite lors du téléchargement.",
            });
        }
    };

    const handleDownloadSummarySheets = async () => {
        try {
            if (!summary_sheets?.length) {
                console.error(
                    "Aucun fichier disponible pour le téléchargement."
                );
                return;
            }

            const downloads = summary_sheets.map(async summary_sheet => {
                try {
                    // Handle user-uploaded files
                    if (summary_sheet.source === "file" && "name" in summary_sheet) {
                        const link = document.createElement("a");
                        link.href = `${process.env.NEXT_PUBLIC_API_URL}/blob/files/${summary_sheet._id}`;
                        link.download = summary_sheet.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        return;
                    }

                    // Handle AI-generated sheets
                    if (summary_sheet.source === "ai" && "content" in summary_sheet) {
                        if (!summary_sheet.content) {
                            console.warn(
                                "Fichier sans contenu ignoré :",
                                summary_sheet?.title ?? "inconnu"
                            );
                            return;
                        }

                        const response = await fetch(summary_sheet.content);
                        if (!response.ok)
                            throw new Error(
                                `Échec du téléchargement : ${summary_sheet.title}`
                            );

                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");

                        a.href = url;
                        a.download = summary_sheet.title || "fiche_revision";
                        document.body.appendChild(a);
                        a.click();

                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }
                } catch (error) {
                    console.error(
                        `Erreur lors du téléchargement :`,
                        error
                    );
                }
            });

            // Attendre que tous les téléchargements soient terminés
            await Promise.all(downloads);
        } catch (error) {
            console.error(
                "Erreur lors du processus de téléchargement :",
                error
            );
            toast("Erreur", {
                description:
                    "Une erreur s'est produite lors du téléchargement.",
            });
        } finally {
            toast("Téléchargement", {
                description: "Les fichiers de révision ont été téléchargés.",
            });
        }
    };

    const handleUpdateShowSummarySheets = (index: number) => {
        if (summary_sheets?.[index]) {
            setShowSummarySheet(summary_sheets[index]);
        }
    };

    if (!summary_sheets || summary_sheets.length === 0) {
        return (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-base font-semibold text-gray-800">
                            Fiches de révision
                        </span>
                    </div>

                    {/* Placeholder Button - Full width on mobile, auto on desktop */}
                    <Button
                        disabled
                        className="w-full lg:w-auto h-10 bg-gray-300 text-gray-500 border border-gray-300 font-medium rounded-xl text-sm lg:flex-shrink-0"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Aucune fiche disponible
                    </Button>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                            Aucune fiche disponible
                        </p>
                        <p className="text-xs text-gray-500">
                            Les fiches de révision apparaîtront ici une fois
                            générées.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!showSummarySheet) {
        return (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold text-gray-800">
                        Fiches de révision
                    </span>
                    <CounterBadge counter={summary_sheets.length} />
                </div>

                {/* Download Button - Full width on mobile, auto on desktop */}
                <Button
                    onClick={handleDownloadSummarySheets}
                    className="w-full lg:w-auto h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 font-medium rounded-xl transition-all duration-200 text-sm lg:flex-shrink-0"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                </Button>
            </div>

            {/* Carousel */}
            <div className="flex items-center justify-between gap-2 flex-1">
                <Button
                    onClick={() =>
                        handleUpdateShowSummarySheets(
                            getArrayForShowSummarySheetInSummarySheets() - 1
                        )
                    }
                    className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 rounded-xl transition-all duration-200"
                    size="icon"
                    variant="ghost"
                    disabled={
                        getArrayForShowSummarySheetInSummarySheets() === 0
                    }
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>

                {/* Summary Sheet Card */}
                <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() =>
                        handleOpenModal(
                            getArrayForShowSummarySheetInSummarySheets()
                        )
                    }
                >
                    <SummarySheetCard summary_sheet={showSummarySheet} />
                </div>

                <Button
                    onClick={() =>
                        handleUpdateShowSummarySheets(
                            getArrayForShowSummarySheetInSummarySheets() + 1
                        )
                    }
                    className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 rounded-xl transition-all duration-200"
                    size="icon"
                    variant="ghost"
                    disabled={
                        getArrayForShowSummarySheetInSummarySheets() >=
                        summary_sheets.length - 1
                    }
                >
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-3">
                {summary_sheets.map((summary_sheet, index) => (
                    <button
                        key={index}
                        onClick={() => handleUpdateShowSummarySheets(index)}
                        className={`rounded-full w-2 h-2 transition-all duration-200 ${
                            getArrayForShowSummarySheetInSummarySheets() ===
                            index
                                ? "bg-blue-600 scale-125"
                                : "bg-blue-300 hover:bg-blue-400"
                        }`}
                    />
                ))}
            </div>

            {/* Full Screen Modal using Portal */}
            {mounted &&
                isModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="fixed top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 group z-[10000]"
                        >
                            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                        </button>

                        {/* Navigation Buttons */}
                        {summary_sheets.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevSheet}
                                    disabled={modalSheetIndex === 0}
                                    className="fixed left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed z-[10000]"
                                >
                                    <ChevronLeft className="w-7 h-7 text-white" />
                                </button>

                                <button
                                    onClick={handleNextSheet}
                                    disabled={
                                        modalSheetIndex ===
                                        summary_sheets.length - 1
                                    }
                                    className="fixed right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed z-[10000]"
                                >
                                    <ChevronRight className="w-7 h-7 text-white" />
                                </button>
                            </>
                        )}

                        {/* Modal Content - Full Screen */}
                        <div className="w-full h-full max-w-7xl mx-auto px-4 py-6 flex flex-col">
                            <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                                {/* Header */}
                                <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                                    <div className="flex items-center gap-4">
                                        <FileText className="w-8 h-8 text-blue-600" />
                                        <p className="text-2xl font-bold text-blue-600">
                                            {(() => {
                                                const currentSheet = summary_sheets[modalSheetIndex];
                                                if (currentSheet?.source === "file" && "name" in currentSheet) {
                                                    return currentSheet.name;
                                                }
                                                if (currentSheet?.source === "ai" && "title" in currentSheet) {
                                                    return currentSheet.title || "Fiche de révision";
                                                }
                                                return "Fiche de révision";
                                            })()}
                                        </p>
                                    </div>
                                </div>

                                {/* Content - Scrollable */}
                                <div className="flex-1 overflow-auto px-12 py-8">
                                    {(() => {
                                        const currentSheet = summary_sheets[modalSheetIndex];

                                        // For AI-generated sheets, display markdown content
                                        if (currentSheet?.source === "ai" && "content" in currentSheet) {
                                            return (
                                                <div
                                                    className="prose prose-lg max-w-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html: marked.parse(currentSheet.content) as string,
                                                    }}
                                                />
                                            );
                                        }

                                        // For uploaded files, display preview or download option
                                        if (currentSheet?.source === "file" && "contentType" in currentSheet) {
                                            const isPDF = currentSheet.contentType === "application/pdf";
                                            const isImage = currentSheet.contentType.startsWith("image/");

                                            if (isPDF) {
                                                return (
                                                    <div className="flex items-center justify-center h-full">
                                                        <iframe
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}/blob/files/${currentSheet._id}`}
                                                            className="w-full h-full border-0 rounded-lg"
                                                            title={currentSheet.name}
                                                        />
                                                    </div>
                                                );
                                            }

                                            if (isImage) {
                                                return (
                                                    <div className="flex items-center justify-center h-full">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}/blob/files/${currentSheet._id}`}
                                                            alt={currentSheet.name}
                                                            className="max-w-full max-h-full object-contain rounded-lg"
                                                        />
                                                    </div>
                                                );
                                            }

                                            // For other file types
                                            return (
                                                <div className="flex flex-col items-center justify-center h-full gap-6">
                                                    <div className="p-8 bg-blue-50 rounded-2xl">
                                                        <FileText className="w-20 h-20 text-blue-600" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-semibold text-gray-800 mb-2">
                                                            {currentSheet.name}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            {currentSheet.contentType}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            const link = document.createElement("a");
                                                            link.href = `${process.env.NEXT_PUBLIC_API_URL}/blob/files/${currentSheet._id}`;
                                                            link.download = currentSheet.name;
                                                            link.click();
                                                        }}
                                                        className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6"
                                                    >
                                                        <Download className="w-5 h-5 mr-2" />
                                                        Télécharger le fichier
                                                    </Button>
                                                </div>
                                            );
                                        }

                                        return null;
                                    })()}
                                </div>

                                {/* Footer with pagination dots and download buttons */}
                                <div className="flex items-center justify-between px-8 py-5 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                                    {/* Pagination dots */}
                                    <div className="flex items-center gap-3 flex-1">
                                        {summary_sheets.length > 1 ? (
                                            summary_sheets.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        setModalSheetIndex(
                                                            index
                                                        )
                                                    }
                                                    className={`rounded-full transition-all duration-200 ${
                                                        modalSheetIndex ===
                                                        index
                                                            ? "w-10 h-3 bg-blue-600"
                                                            : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                                                    }`}
                                                />
                                            ))
                                        ) : (
                                            <div />
                                        )}
                                    </div>

                                    {/* Download buttons */}
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={handleDownloadCurrentSheet}
                                            className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 px-4"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Télécharger cette fiche
                                        </Button>
                                        {summary_sheets.length > 1 && (
                                            <Button
                                                onClick={
                                                    handleDownloadAllSheets
                                                }
                                                variant="outline"
                                                className="h-10 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all duration-200 px-4"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Tout télécharger (
                                                {summary_sheets.length})
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

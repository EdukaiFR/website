"use client";

import { useState, useEffect } from "react";
import { CounterBadge } from "@/components/badge/CounterBadge";
import { Button } from "@/components/ui/button";
import { AddSummarySheet } from "./AddSummarySheet";
import { generateMarkdownPdf } from "@/lib/summary-sheets/md2pdf";
import { useSheet } from "@/hooks";
import { useSummarySheetService } from "@/services";
import {
    FileText,
    Download,
    Eye,
    Trash,
    Calendar,
    User,
    Search,
    Grid,
    List,
    DownloadCloud,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SummarySheetData } from "@/lib/types/library";

export interface SummarySheetProps {
    user_id: string;
    course_id: string;
    summarySheets: SummarySheetData[] | [];
}

export const SummarySheets = ({
    user_id,
    course_id,
    summarySheets,
}: SummarySheetProps) => {
    const typedSummarySheets: SummarySheetData[] =
        summarySheets && summarySheets.length > 0 ? summarySheets : [];

    const [localSummarySheets, setLocalSummarySheets] =
        useState<SummarySheetData[]>(typedSummarySheets);

    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [currentFileIndex, setCurrentFileIndex] = useState(0);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const summarySheetsService = useSummarySheetService();
    const { error, deleteSheetById } = useSheet(summarySheetsService);

    const filteredFiles = localSummarySheets.filter(file =>
        file.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setLocalSummarySheets(typedSummarySheets);
    }, [typedSummarySheets]);

    const handleDelete = async (file: SummarySheetData) => {
        try {
            const { status, message } = await deleteSheetById(file._id);
            if (status === "success") {
                setLocalSummarySheets(prevSheets =>
                    prevSheets.filter(sheet => sheet._id !== file._id)
                );
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error(
                "Erreur lors de la suppression de la fiche de révision"
            );
        }
    };

    const handleDownload = async (file: SummarySheetData) => {
        await generateMarkdownPdf(course_id, file.content);
    };

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const handleBulkDownload = async () => {
        try {
            const downloadPromises = filteredFiles.map(async (file, index) => {
                await delay(index * 500);
                await generateMarkdownPdf(course_id, file.content);
            });

            await Promise.all(downloadPromises);

            toast.success(
                `${filteredFiles.length} fichier${
                    filteredFiles.length > 1 ? "s" : ""
                } téléchargé${filteredFiles.length > 1 ? "s" : ""} avec succès!`
            );
        } catch (error) {
            toast.error("Erreur lors du téléchargement des fichiers");
            console.error("Bulk download error:", error);
        }
    };

    const handlePreviewFile = (file: SummarySheetData) => {
        const fileIndex = filteredFiles.findIndex(f => f._id === file._id);
        setCurrentFileIndex(fileIndex);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
    };

    const handleNavigate = (direction: "prev" | "next") => {
        if (direction === "prev" && currentFileIndex > 0) {
            setCurrentFileIndex(currentFileIndex - 1);
        } else if (
            direction === "next" &&
            currentFileIndex < filteredFiles.length - 1
        ) {
            setCurrentFileIndex(currentFileIndex + 1);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="w-full flex flex-col min-h-[calc(100vh-12rem)] sm:min-h-[65vh] gap-4 sm:gap-6 overflow-auto">
            {/* Header Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border-0 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex-shrink-0">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                                Fiches de révision
                            </h1>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                Gérez vos documents de révision
                            </p>
                        </div>
                        <CounterBadge
                            counter={filteredFiles.length}
                            type="élements"
                            size="sm"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        {filteredFiles.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleBulkDownload}
                                className="h-10 border-green-200 hover:bg-green-50 text-green-700 font-medium rounded-xl"
                            >
                                <DownloadCloud className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">
                                    Tout télécharger ({filteredFiles.length})
                                </span>
                                <span className="sm:hidden">
                                    Télécharger ({filteredFiles.length})
                                </span>
                            </Button>
                        )}
                        <AddSummarySheet />
                    </div>
                </div>

                {/* Search and View Toggle */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Rechercher une fiche..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 h-10 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className={`rounded-lg flex-1 sm:flex-none ${
                                viewMode === "grid"
                                    ? "bg-white shadow-sm text-blue-600"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className={`rounded-lg flex-1 sm:flex-none ${
                                viewMode === "list"
                                    ? "bg-white shadow-sm text-blue-600"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1">
                {filteredFiles.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border-0 shadow-lg text-center">
                        <div className="max-w-md mx-auto">
                            <div className="p-4 bg-blue-50 rounded-2xl w-fit mx-auto mb-6">
                                <FileText className="w-12 h-12 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {searchTerm
                                    ? "Aucun fichier trouvé"
                                    : "Aucune fiche de révision"}
                            </h3>
                            <p className="text-gray-600 text-sm mb-6">
                                {searchTerm
                                    ? "Essayez de modifier votre recherche ou ajoutez de nouveaux fichiers."
                                    : "Commencez par ajouter vos premières fiches de révision pour organiser votre apprentissage."}
                            </p>
                            {!searchTerm && <AddSummarySheet />}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`${
                            viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
                                : "flex flex-col gap-3 sm:gap-4"
                        }`}
                    >
                        {filteredFiles.map((file, index) => (
                            <div
                                key={file._id}
                                className={`bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-200 group ${
                                    viewMode === "grid"
                                        ? "p-4 sm:p-6"
                                        : "p-3 sm:p-4"
                                }`}
                            >
                                {viewMode === "grid" ? (
                                    // Grid View
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-lg"
                                                    onClick={() =>
                                                        handlePreviewFile(file)
                                                    }
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-lg"
                                                    onClick={() =>
                                                        handleDownload(file)
                                                    }
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                                    onClick={() =>
                                                        handleDelete(file)
                                                    }
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                                FicheRevision-{index + 1}
                                            </h3>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {formatDate(
                                                            file.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    <span>
                                                        {user_id === file.author
                                                            ? "Vous"
                                                            : "Auteur Inconnu"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // List View
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-800 truncate">
                                                    FicheRevision-{index + 1}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(
                                                            file.createdAt
                                                        )}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {user_id === file.author
                                                            ? "Vous"
                                                            : "Auteur Inconnu"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
                                                onClick={() =>
                                                    handlePreviewFile(file)
                                                }
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg"
                                                onClick={() =>
                                                    handleDownload(file)
                                                }
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* File Preview Dialog */}
            {/* {filteredFiles.length > 0 && (
        <FilePreviewDialog
          files={filteredFiles}
          currentFileIndex={currentFileIndex}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          onDownload={handleDownload}
          onNavigate={handleNavigate}
        />
      )} */}
        </div>
    );
};

/* eslint-disable unused-imports/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import { CounterBadge } from "@/components/badge/CounterBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSheet } from "@/hooks";
import { generateMarkdownPdf } from "@/lib/summary-sheets/md2pdf";
import { SummarySheetData } from "@/lib/types/library";
import { useBlobService, useSummarySheetService } from "@/services";
import {
    Calendar,
    Download,
    DownloadCloud,
    Eye,
    FileText,
    Grid,
    List,
    Search,
    Trash,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddSummarySheet } from "./AddSummarySheet";

export interface SummarySheetProps {
    user_id: string;
    course_id: string;
    summarySheets: SummarySheetData[] | [];
    onRefresh?: () => void;
}

export const SummarySheets = ({
    user_id,
    course_id,
    summarySheets,
    onRefresh,
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
    const blobService = useBlobService();
    const { error, deleteSheetById } = useSheet(summarySheetsService);

    const filteredFiles = localSummarySheets.filter(file => {
        const searchLower = searchTerm.toLowerCase();

        // For AI-generated sheets, search in content
        if (file.source === "ai" && "content" in file) {
            return file.content.toLowerCase().includes(searchLower);
        }

        // For user-uploaded files, search in name
        if (file.source === "file" && "name" in file) {
            return file.name.toLowerCase().includes(searchLower);
        }

        return false;
    });

    useEffect(() => {
        setLocalSummarySheets(typedSummarySheets);
    }, [summarySheets]);

    const handleDelete = async (file: SummarySheetData) => {
        try {
            let response;

            // Use different service based on file source
            if (file.source === "file") {
                // User-uploaded file - use blob service
                response = await blobService.deleteFile(file._id);
            } else {
                // AI-generated sheet - use summary sheet service
                response = await deleteSheetById(file._id);
            }

            if (response?.status === "success") {
                setLocalSummarySheets(prevSheets =>
                    prevSheets.filter(sheet => sheet._id !== file._id)
                );
                toast.success(response.message || "Fichier supprimé avec succès");

                // Refresh the list from backend
                if (onRefresh) {
                    onRefresh();
                }
            } else {
                toast.error(response?.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("[SummarySheets] Error in handleDelete:", error);
            toast.error(
                "Erreur lors de la suppression de la fiche de révision"
            );
        }
    };

    const handleDownload = async (file: SummarySheetData) => {
        // For uploaded files, download directly
        if (file.source === "file" && "name" in file) {
            const link = document.createElement("a");
            link.href = `${process.env.NEXT_PUBLIC_API_URL}/blob/files/${file._id}`;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            return;
        }

        // For AI-generated sheets, generate PDF from markdown
        if (file.source === "ai" && "content" in file) {
            await generateMarkdownPdf(course_id, file.content);
        }
    };

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const handleBulkDownload = async () => {
        try {
            const downloadPromises = filteredFiles.map(async (file, index) => {
                await delay(index * 500);

                // For uploaded files, download directly
                if (file.source === "file" && "name" in file) {
                    const link = document.createElement("a");
                    link.href = `${process.env.NEXT_PUBLIC_API_URL}/blob/files/${file._id}`;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    return;
                }

                // For AI-generated sheets, generate PDF from markdown
                if (file.source === "ai" && "content" in file) {
                    await generateMarkdownPdf(course_id, file.content);
                }
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Fiches de révision
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Gérez vos documents de révision
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <CounterBadge
                                counter={filteredFiles.length}
                                type="élements"
                                size="sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {filteredFiles.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleBulkDownload}
                                className="h-11 border-green-200/60 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
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
                        <AddSummarySheet courseId={course_id} onUploadSuccess={onRefresh} />
                    </div>
                </div>

                {/* Search and View Toggle */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Rechercher une fiche..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>
                    <div className="flex bg-blue-50/50 backdrop-blur-sm rounded-xl p-1.5 border border-blue-100/50 w-full sm:w-auto shadow-sm">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className={`rounded-lg flex-1 sm:flex-none transition-all duration-200 ${
                                viewMode === "grid"
                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md text-white hover:from-blue-700 hover:to-blue-600"
                                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                            }`}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className={`rounded-lg flex-1 sm:flex-none transition-all duration-200 ${
                                viewMode === "list"
                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md text-white hover:from-blue-700 hover:to-blue-600"
                                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
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
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-blue-100/50 shadow-xl text-center">
                        <div className="max-w-md mx-auto">
                            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl w-fit mx-auto mb-6 shadow-sm">
                                <FileText className="w-14 h-14 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                {searchTerm
                                    ? "Aucun fichier trouvé"
                                    : "Aucune fiche de révision"}
                            </h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {searchTerm
                                    ? "Essayez de modifier votre recherche ou ajoutez de nouveaux fichiers."
                                    : "Commencez par ajouter vos premières fiches de révision pour organiser votre apprentissage."}
                            </p>
                            {!searchTerm && <AddSummarySheet courseId={course_id} onUploadSuccess={onRefresh} />}
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
                                className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-300 group ${
                                    viewMode === "grid"
                                        ? "p-6"
                                        : "p-4"
                                }`}
                            >
                                {viewMode === "grid" ? (
                                    // Grid View
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm">
                                                <FileText className="w-7 h-7 text-blue-600" />
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-9 w-9 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg shadow-sm transition-all duration-200"
                                                    onClick={() =>
                                                        handlePreviewFile(file)
                                                    }
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-9 w-9 p-0 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg shadow-sm transition-all duration-200"
                                                    onClick={() =>
                                                        handleDownload(file)
                                                    }
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-9 w-9 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg shadow-sm transition-all duration-200"
                                                    onClick={() =>
                                                        handleDelete(file)
                                                    }
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 mb-4 line-clamp-2 text-lg">
                                                Fiche {index + 1}
                                            </h3>

                                            <div className="space-y-2.5 text-sm text-gray-600">
                                                <div className="flex items-center gap-2 bg-blue-50/50 rounded-lg p-2">
                                                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                    <span className="truncate">
                                                        {formatDate(
                                                            file.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-purple-50/50 rounded-lg p-2">
                                                    <User className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                                    <span className="truncate">
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
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 truncate text-base mb-1.5">
                                                    Fiche {index + 1}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1.5 bg-blue-50/50 rounded-lg px-2 py-1">
                                                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                        {formatDate(
                                                            file.createdAt
                                                        )}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-purple-50/50 rounded-lg px-2 py-1">
                                                        <User className="w-3.5 h-3.5 text-purple-600" />
                                                        {user_id === file.author
                                                            ? "Vous"
                                                            : "Auteur Inconnu"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-10 w-10 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg shadow-sm transition-all duration-200"
                                                onClick={() =>
                                                    handlePreviewFile(file)
                                                }
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-10 w-10 p-0 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg shadow-sm transition-all duration-200"
                                                onClick={() =>
                                                    handleDownload(file)
                                                }
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-10 w-10 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg shadow-sm transition-all duration-200"
                                                onClick={() =>
                                                    handleDelete(file)
                                                }
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

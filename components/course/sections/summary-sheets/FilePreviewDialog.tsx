"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Download,
    ExternalLink,
    Calendar,
    User,
    File,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

type FileData = {
    id: number;
    src: string;
    alt: string;
    added_at: string;
    origin: string;
};

export type FilePreviewDialogProps = {
    files: FileData[];
    currentFileIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onDownload: (file: FileData) => void;
    onNavigate: (direction: "prev" | "next") => void;
};

export const FilePreviewDialog = ({
    files,
    currentFileIndex,
    isOpen,
    onClose,
    onDownload,
    onNavigate,
}: FilePreviewDialogProps) => {
    const [imageError, setImageError] = useState(false);
    const [pdfError, setPdfError] = useState(false);

    const file = files[currentFileIndex];
    const hasPrevious = currentFileIndex > 0;
    const hasNext = currentFileIndex < files.length - 1;

    // Reset errors when file changes
    useEffect(() => {
        setImageError(false);
        setPdfError(false);
    }, [currentFileIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowLeft" && hasPrevious) {
                onNavigate("prev");
            } else if (e.key === "ArrowRight" && hasNext) {
                onNavigate("next");
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, hasPrevious, hasNext, onNavigate, onClose]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getFileExtension = (filename: string) => {
        const extension = filename.split(".").pop()?.toLowerCase() || "";
        return extension;
    };

    const isImage = (filename: string, src?: string) => {
        const imageExtensions = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "svg",
            "bmp",
            "tiff",
        ];
        const fileExt = getFileExtension(filename);

        // Check file extension first
        if (imageExtensions.includes(fileExt)) {
            return true;
        }

        // Check if URL contains image indicators
        if (src) {
            const srcLower = src.toLowerCase();
            return imageExtensions.some(ext => srcLower.includes(`.${ext}`));
        }

        return false;
    };

    const isPDF = (filename: string, src?: string) => {
        const fileExt = getFileExtension(filename);

        // Check file extension first
        if (fileExt === "pdf") {
            return true;
        }

        // Check if URL contains PDF indicators
        if (src) {
            return (
                src.toLowerCase().includes(".pdf") ||
                src.toLowerCase().includes("pdf")
            );
        }

        return false;
    };

    const getFileIcon = (filename: string) => {
        if (isImage(filename, file.src))
            return (
                <Image
                    src={file.src}
                    alt={filename}
                    width={32}
                    height={32}
                    className="w-8 h-8 text-purple-600"
                />
            );
        if (isPDF(filename, file.src))
            return <FileText className="w-8 h-8 text-red-600" />;
        return <File className="w-8 h-8 text-blue-600" />;
    };

    const getFileTypeColor = (filename: string) => {
        if (isImage(filename, file.src))
            return "bg-purple-50 text-purple-700 border-purple-200";
        if (isPDF(filename, file.src))
            return "bg-red-50 text-red-700 border-red-200";
        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    const renderFilePreview = () => {
        // Debug info (you can remove this in production)
        console.log("File debug info:", {
            filename: file.alt,
            src: file.src,
            extension: getFileExtension(file.alt),
            isImageDetected: isImage(file.alt, file.src),
            isPDFDetected: isPDF(file.alt, file.src),
        });

        // Image preview
        if (isImage(file.alt, file.src) && !imageError) {
            return (
                <div className="relative group">
                    <div className="bg-gray-50 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                        <Image
                            src={file.src}
                            alt={file.alt}
                            className="max-w-full max-h-[400px] object-contain rounded-xl shadow-lg"
                            width={100}
                            height={100}
                            onError={(e: unknown) => {
                                console.log(e);
                                console.error(
                                    "Image failed to load:",
                                    file.src
                                );
                                setImageError(true);
                            }}
                            onLoad={() => {
                                console.log(
                                    "Image loaded successfully:",
                                    file.src
                                );
                                setImageError(false);
                            }}
                        />
                    </div>
                </div>
            );
        }

        // PDF preview
        if (isPDF(file.alt, file.src) && !pdfError) {
            return (
                <div className="bg-gray-50 rounded-2xl p-8 min-h-[400px]">
                    <iframe
                        src={`${file.src}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-[400px] rounded-xl shadow-lg border-0"
                        title={file.alt}
                        onError={() => {
                            console.error("PDF failed to load:", file.src);
                            setPdfError(true);
                        }}
                        onLoad={() => {
                            console.log("PDF loaded successfully:", file.src);
                            setPdfError(false);
                        }}
                    />
                </div>
            );
        }

        // Default preview for other file types or failed loads
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-white rounded-2xl shadow-lg mb-6">
                    {getFileIcon(file.alt)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {imageError || pdfError
                        ? "Erreur de chargement"
                        : "Aperçu non disponible"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                    {imageError
                        ? "Impossible de charger l'image. Le fichier est peut-être corrompu ou inaccessible."
                        : pdfError
                          ? "Impossible de charger le PDF. Essayez de le télécharger ou de l'ouvrir dans un nouvel onglet."
                          : "Ce type de fichier ne peut pas être prévisualisé directement. Vous pouvez le télécharger ou l'ouvrir dans une nouvelle fenêtre."}
                </p>
                <div className="text-xs text-gray-500 mb-4 p-3 bg-white rounded-lg border">
                    <strong>Détection:</strong>{" "}
                    {getFileExtension(file.alt).toUpperCase() ||
                        "Aucune extension"}{" "}
                    | Type:{" "}
                    {isImage(file.alt, file.src)
                        ? "Image"
                        : isPDF(file.alt, file.src)
                          ? "PDF"
                          : "Autre"}
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => onDownload(file)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.open(file.src, "_blank")}
                        className="border-gray-300 hover:bg-gray-50"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ouvrir
                    </Button>
                </div>
            </div>
        );
    };

    if (!file) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex-shrink-0">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <DialogTitle className="text-xl font-bold text-gray-800 truncate">
                                        {file.alt}
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-600 mt-1">
                                        Fichier {currentFileIndex + 1} sur{" "}
                                        {files.length} • Prévisualisation
                                    </DialogDescription>

                                    {/* File metadata */}
                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                        <Badge
                                            variant="outline"
                                            className={`${getFileTypeColor(file.alt)} font-medium`}
                                        >
                                            {getFileExtension(
                                                file.alt
                                            ).toUpperCase() || "INCONNU"}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {formatDate(file.added_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <User className="w-4 h-4" />
                                            <span>{file.origin}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Preview Content with Floating Navigation */}
                    <div className="p-6 relative">
                        {renderFilePreview()}

                        {/* Beautiful Floating Navigation Buttons */}
                        {files.length > 1 && (
                            <>
                                {/* Previous Button */}
                                {hasPrevious && (
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 p-0 bg-white/90 hover:bg-white backdrop-blur-xl shadow-xl hover:shadow-2xl border border-white/20 rounded-2xl transition-all duration-300 hover:scale-110 z-10"
                                        onClick={() => onNavigate("prev")}
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                                    </Button>
                                )}

                                {/* Next Button */}
                                {hasNext && (
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 p-0 bg-white/90 hover:bg-white backdrop-blur-xl shadow-xl hover:shadow-2xl border border-white/20 rounded-2xl transition-all duration-300 hover:scale-110 z-10"
                                        onClick={() => onNavigate("next")}
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-700" />
                                    </Button>
                                )}

                                {/* Navigation Indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                                    <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                        {currentFileIndex + 1} / {files.length}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Ajouté le {formatDate(file.added_at)} par{" "}
                                {file.origin}
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        window.open(file.src, "_blank")
                                    }
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Ouvrir dans un nouvel onglet
                                </Button>
                                <Button
                                    onClick={() => onDownload(file)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Télécharger
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

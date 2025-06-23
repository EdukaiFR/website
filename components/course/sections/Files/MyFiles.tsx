"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import JSZip from "jszip";
import {
    Archive,
    Calendar,
    Download,
    Eye,
    File,
    FileText,
    Image,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface FileData {
    _id: string;
    name: string;
    contentType: string;
    fileContent: string;
    fileType: string;
    createdAt: string;
    updatedAt: string;
}

interface UnzippedFile {
    name: string;
    content: string;
    contentType: string;
    size: number;
}

interface ProcessedFile extends FileData {
    unzippedFiles?: UnzippedFile[];
    isZip?: boolean;
    decompressionSuccessful?: boolean;
}

interface MyFilesProps {
    courseId: string;
    getCourseFiles: (courseId: string) => Promise<unknown>;
}

export default function MyFiles({ courseId, getCourseFiles }: MyFilesProps) {
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatFileSize = (sizeInBytes: number) => {
        const mb = sizeInBytes / (1024 * 1024);
        return mb < 1
            ? `${(sizeInBytes / 1024).toFixed(1)} KB`
            : `${mb.toFixed(1)} MB`;
    };

    const getContentTypeFromFilename = useCallback(
        (filename: string): string => {
            const extension = filename.split(".").pop()?.toLowerCase();
            switch (extension) {
                case "pdf":
                    return "application/pdf";
                case "jpg":
                case "jpeg":
                    return "image/jpeg";
                case "png":
                    return "image/png";
                case "gif":
                    return "image/gif";
                case "txt":
                    return "text/plain";
                case "doc":
                    return "application/msword";
                case "docx":
                    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                default:
                    return "application/octet-stream";
            }
        },
        []
    );

    const unzipFile = async (
        data: string | ArrayBuffer,
        filename: string
    ): Promise<ProcessedFile[]> => {
        console.log("📦 Starting ZIP decompression...");

        try {
            const zip = await JSZip.loadAsync(data);
            console.log("✅ ZIP loaded successfully");

            const unzippedFiles: UnzippedFile[] = [];

            for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
                if (!zipEntry.dir) {
                    try {
                        const fileName =
                            zipEntry.name.split("/").pop() || zipEntry.name;
                        const contentType =
                            getContentTypeFromFilename(fileName);

                        const content =
                            contentType.startsWith("image/") ||
                            contentType.includes("pdf") ||
                            contentType.includes("zip") ||
                            contentType.includes("binary")
                                ? await zipEntry.async("base64")
                                : await zipEntry.async("string");

                        unzippedFiles.push({
                            name: fileName,
                            content:
                                contentType.startsWith("image/") ||
                                contentType.includes("pdf") ||
                                contentType.includes("zip") ||
                                contentType.includes("binary")
                                    ? content
                                    : btoa(content),
                            contentType,
                            size: content.length,
                        });
                    } catch (error) {
                        console.warn(
                            `⚠️ Could not extract file ${relativePath}:`,
                            error
                        );
                    }
                }
            }

            if (unzippedFiles.length > 0) {
                return [
                    {
                        _id: `zip-${Date.now()}`,
                        name: filename,
                        contentType: "application/zip",
                        fileContent: "",
                        fileType: "zip",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isZip: true,
                        unzippedFiles,
                        decompressionSuccessful: true,
                    },
                ];
            }

            return [];
        } catch (error) {
            console.error("❌ ZIP decompression failed:", error);
            throw error;
        }
    };

    const fetchFiles = async () => {
        if (!courseId) return;

        setLoading(true);
        setError(null);
        setFiles([]);

        try {
            console.log("🔄 Fetching files for course:", courseId);

            const response = await fetch(
                `/api/courses/${courseId}/files?format=base64`
            );

            if (!response.ok) {
                console.log(
                    "🔄 Base64 endpoint not available, trying original method..."
                );
                const originalResponse = await getCourseFiles(courseId);

                if (typeof originalResponse === "string") {
                    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
                    if (base64Regex.test(originalResponse.slice(0, 100))) {
                        const blob = await fetch(
                            `data:application/zip;base64,${originalResponse}`
                        ).then(r => r.blob());
                        const arrayBuffer = await blob.arrayBuffer();
                        const extractedFiles = await unzipFile(
                            arrayBuffer,
                            "course-files.zip"
                        );
                        setFiles(extractedFiles);
                    } else {
                        const bytes = new Uint8Array(originalResponse.length);
                        for (let i = 0; i < originalResponse.length; i++) {
                            bytes[i] = originalResponse.charCodeAt(i) & 0xff;
                        }
                        const extractedFiles = await unzipFile(
                            bytes.buffer,
                            "course-files.zip"
                        );
                        setFiles(extractedFiles);
                    }
                } else if (originalResponse instanceof ArrayBuffer) {
                    const extractedFiles = await unzipFile(
                        originalResponse,
                        "course-files.zip"
                    );
                    setFiles(extractedFiles);
                }
                return;
            }

            const base64Data = await response.text();
            const blob = await fetch(
                `data:application/zip;base64,${base64Data}`
            ).then(r => r.blob());
            const arrayBuffer = await blob.arrayBuffer();

            const extractedFiles = await unzipFile(
                arrayBuffer,
                "course-files.zip"
            );
            setFiles(extractedFiles);
        } catch (error) {
            console.error("❌ Error fetching files:", error);
            setError("Impossible de charger les fichiers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchFiles();
        }
    }, [courseId, getCourseFiles]);

    const getFileIcon = (contentType: string, isZip?: boolean) => {
        if (isZip) return <Archive className="w-5 h-5" />;
        if (contentType.includes("image")) return <Image className="w-5 h-5" />;
        if (contentType.includes("text") || contentType.includes("pdf"))
            return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const downloadUnzippedFile = (unzippedFile: UnzippedFile) => {
        const bytes = new Uint8Array(
            atob(unzippedFile.content)
                .split("")
                .map(c => c.charCodeAt(0))
        );
        const blob = new Blob([bytes], { type: unzippedFile.contentType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = unzippedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const isImage = (contentType: string) => {
        return contentType.startsWith("image/");
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des fichiers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-2">Erreur</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-auto max-w-full p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Mes fichiers
                </h1>
                <p className="text-gray-600">
                    Fichiers utilisés lors de la génération de ce cours
                </p>
                <Badge variant="secondary" className="mt-2">
                    {files.length} fichier{files.length !== 1 ? "s" : ""}
                </Badge>
            </div>

            {files.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                            Aucun fichier trouvé pour ce cours
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {files.map(file => (
                        <div key={file._id} className="space-y-4">
                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        {getFileIcon(
                                            file.contentType,
                                            file.isZip
                                        )}
                                        <span className="truncate">
                                            {file.name}
                                        </span>
                                        {file.isZip && (
                                            <Badge
                                                variant="outline"
                                                className="ml-2"
                                            >
                                                ZIP (
                                                {file.unzippedFiles?.length ||
                                                    0}{" "}
                                                fichiers)
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                Type:
                                            </span>
                                            <span>{file.contentType}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(
                                                    file.createdAt
                                                ).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {file.isZip &&
                                file.unzippedFiles &&
                                file.unzippedFiles.length > 0 && (
                                    <div className="ml-4 border-l-2 border-gray-200 pl-4">
                                        <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                            Contenu décompressé:
                                        </h3>
                                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                            {file.unzippedFiles.map(
                                                (unzippedFile, index) => (
                                                    <Card
                                                        key={index}
                                                        className="hover:shadow-sm transition-shadow"
                                                    >
                                                        <CardHeader className="pb-2">
                                                            <CardTitle className="flex items-center gap-2 text-sm">
                                                                {getFileIcon(
                                                                    unzippedFile.contentType
                                                                )}
                                                                <span className="truncate text-xs">
                                                                    {
                                                                        unzippedFile.name
                                                                    }
                                                                </span>
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="pt-0">
                                                            <div className="space-y-1 text-xs text-gray-600 mb-3">
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Type:{" "}
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            unzippedFile.contentType
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Taille:{" "}
                                                                    </span>
                                                                    <span>
                                                                        {formatFileSize(
                                                                            unzippedFile.size
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                {isImage(
                                                                    unzippedFile.contentType
                                                                ) && (
                                                                    <Dialog>
                                                                        <DialogTrigger
                                                                            asChild
                                                                        >
                                                                            <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors">
                                                                                <Eye className="w-3 h-3" />
                                                                                Aperçu
                                                                            </button>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="max-w-6xl w-[95vw] h-[95vh] p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-2xl">
                                                                            <div className="flex flex-col h-full">
                                                                                <DialogHeader className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
                                                                                    <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                                                                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                                                                            <Image className="w-5 h-5 text-white" />
                                                                                        </div>
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <div className="truncate">
                                                                                                {
                                                                                                    unzippedFile.name
                                                                                                }
                                                                                            </div>
                                                                                            <div className="text-sm font-normal text-slate-500 mt-1">
                                                                                                {
                                                                                                    unzippedFile.contentType
                                                                                                }{" "}
                                                                                                •{" "}
                                                                                                {formatFileSize(
                                                                                                    unzippedFile.size
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </DialogTitle>
                                                                                </DialogHeader>

                                                                                <div className="flex-1 flex items-center justify-center p-6 min-h-0">
                                                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-2xl"></div>

                                                                                        <div className="relative max-w-full max-h-full">
                                                                                            <img
                                                                                                src={`data:${unzippedFile.contentType};base64,${unzippedFile.content}`}
                                                                                                alt={
                                                                                                    unzippedFile.name
                                                                                                }
                                                                                                className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-white/50"
                                                                                                style={{
                                                                                                    maxHeight:
                                                                                                        "calc(95vh - 200px)",
                                                                                                    filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.1))",
                                                                                                }}
                                                                                            />

                                                                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-t border-slate-200/50">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center gap-4">
                                                                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full">
                                                                                                <File className="w-4 h-4 text-slate-600" />
                                                                                                <span className="text-sm font-medium text-slate-700">
                                                                                                    {unzippedFile.name
                                                                                                        .split(
                                                                                                            "."
                                                                                                        )
                                                                                                        .pop()
                                                                                                        ?.toUpperCase()}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 rounded-full">
                                                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                                                <span className="text-sm font-medium text-blue-700">
                                                                                                    {formatFileSize(
                                                                                                        unzippedFile.size
                                                                                                    )}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>

                                                                                        <button
                                                                                            onClick={() =>
                                                                                                downloadUnzippedFile(
                                                                                                    unzippedFile
                                                                                                )
                                                                                            }
                                                                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                                                        >
                                                                                            <Download className="w-4 h-4" />
                                                                                            <span className="font-medium">
                                                                                                Télécharger
                                                                                            </span>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                )}

                                                                <button
                                                                    onClick={() =>
                                                                        downloadUnzippedFile(
                                                                            unzippedFile
                                                                        )
                                                                    }
                                                                    className={`${isImage(unzippedFile.contentType) ? "flex-1" : "w-full"} flex items-center justify-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors`}
                                                                >
                                                                    <Download className="w-3 h-3" />
                                                                    Télécharger
                                                                </button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

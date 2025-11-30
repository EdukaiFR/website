"use client";

import clsx from "clsx";
import { Camera, CloudUpload, Link as LinkIcon, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    convertFileToBase64,
    getImageDisplaySrc,
    isValidImageType,
} from "@/lib/image-utils";

interface ProfilePictureUploadProps {
    value?: string;
    onChange: (value: string) => void;
    error?: string;
    className?: string;
}

type UploadMode = "url" | "file";

export function ProfilePictureUpload({
    value,
    onChange,
    error,
    className,
}: ProfilePictureUploadProps) {
    const [mode, setMode] = useState<UploadMode>("file");
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [urlInput, setUrlInput] = useState(value || "");

    const displaySrc = getImageDisplaySrc(value);

    const handleFileUpload = useCallback(
        async (file: File) => {
            if (!isValidImageType(file)) {
                return;
            }

            try {
                setIsUploading(true);
                const base64 = await convertFileToBase64(file);
                onChange(base64);
            } catch (error) {
                console.error("Error uploading file:", error);
            } finally {
                setIsUploading(false);
            }
        },
        [onChange]
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragActive(false);

        const file = event.dataTransfer.files[0];
        if (file && isValidImageType(file)) {
            handleFileUpload(file);
        }
    };

    const handleUrlChange = (url: string) => {
        setUrlInput(url);
        onChange(url);
    };

    const clearImage = () => {
        onChange("");
        setUrlInput("");
    };

    return (
        <Card
            className={clsx(
                "bg-gradient-to-br from-blue-50/50 to-white border border-blue-100/50 overflow-hidden",
                className
            )}
        >
            <CardContent className="p-5 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                            <Camera
                                className="w-4 h-4 text-white"
                                aria-label="Photo de profil"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-900">
                                Photo de profil
                            </label>
                            <p className="text-xs text-gray-500">
                                Personnalisez votre avatar
                            </p>
                        </div>
                    </div>
                    {value && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearImage}
                            className="h-8 px-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Mode Tabs */}
                <div className="flex bg-blue-100/50 rounded-xl p-1.5 gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={clsx(
                            "flex-1 h-10 rounded-lg transition-all duration-200 font-medium",
                            mode === "url"
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600"
                                : "text-gray-700 hover:bg-white/50 hover:text-blue-700"
                        )}
                        onClick={() => setMode("url")}
                    >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        URL
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={clsx(
                            "flex-1 h-10 rounded-lg transition-all duration-200 font-medium",
                            mode === "file"
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600"
                                : "text-gray-700 hover:bg-white/50 hover:text-blue-700"
                        )}
                        onClick={() => setMode("file")}
                    >
                        <CloudUpload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                </div>

                {/* URL Mode */}
                {mode === "url" && (
                    <div className="space-y-3">
                        <Input
                            type="url"
                            placeholder="https://exemple.com/votre-photo.jpg"
                            value={urlInput}
                            onChange={e => handleUrlChange(e.target.value)}
                            className={clsx(
                                "h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white",
                                error
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                    : "border-blue-200"
                            )}
                        />
                        <div className="flex items-start gap-2 bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                            <LinkIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Collez l'URL de votre photo de profil (JPG, PNG
                                recommandé).
                            </p>
                        </div>
                    </div>
                )}

                {/* File Upload Mode */}
                {mode === "file" && (
                    <div className="space-y-3">
                        <label
                            htmlFor="profile-file-input"
                            className={clsx(
                                "block relative border-dashed border-2 rounded-xl p-8 text-center transition-all duration-300 group",
                                isDragActive
                                    ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-[1.02]"
                                    : isUploading
                                      ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                                      : "border-blue-300 bg-gradient-to-br from-white to-blue-50/30 hover:from-blue-50/50 hover:to-blue-100/50 hover:border-blue-500 hover:shadow-md cursor-pointer"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="profile-file-input"
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            <div className="flex flex-col items-center justify-center">
                                {isUploading ? (
                                    <>
                                        <div className="p-4 bg-gray-200 rounded-xl mb-4 animate-pulse">
                                            <CloudUpload className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700 mb-1">
                                            Upload en cours...
                                        </p>
                                        <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-[loading_1s_ease-in-out_infinite]"
                                                style={{ width: "70%" }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative mb-4">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                            <div className="relative p-4 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <CloudUpload className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 mb-2">
                                            Glissez une image ici ou cliquez
                                        </p>
                                        <p className="text-xs text-blue-700 font-medium bg-blue-100 px-3 py-1.5 rounded-full">
                                            JPG, PNG (max 2MB)
                                        </p>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                )}

                {/* Image Preview */}
                {displaySrc && (
                    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full opacity-75 blur" />
                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white ring-4 ring-white shadow-lg">
                                    <Image
                                        src={displaySrc}
                                        alt="Aperçu photo de profil"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Photo de profil sélectionnée
                                </p>
                                <p className="text-xs text-blue-700 mt-1 truncate font-medium">
                                    {value?.startsWith("data:")
                                        ? "✓ Image uploadée avec succès"
                                        : "✓ Image depuis URL"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700 flex items-center gap-2">
                            <span className="text-base">⚠</span>
                            {error}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

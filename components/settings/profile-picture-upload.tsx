"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { CloudUpload, Link as LinkIcon, X, Camera } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    convertFileToBase64,
    isValidImageType,
    getImageDisplaySrc,
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
    const [mode, setMode] = useState<UploadMode>("url");
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
        <div className={clsx("space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Camera className="w-4 h-4" aria-label="Photo de profil" />
                    Photo de profil (optionnel)
                </label>
                {value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearImage}
                        className="h-auto p-1 text-gray-500 hover:text-red-500"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                    type="button"
                    variant={mode === "url" ? "default" : "ghost"}
                    size="sm"
                    className={clsx(
                        "flex-1 h-9",
                        mode === "url"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setMode("url")}
                >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    URL
                </Button>
                <Button
                    type="button"
                    variant={mode === "file" ? "default" : "ghost"}
                    size="sm"
                    className={clsx(
                        "flex-1 h-9",
                        mode === "file"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setMode("file")}
                >
                    <CloudUpload className="w-4 h-4 mr-2" />
                    Upload
                </Button>
            </div>

            {/* URL Mode */}
            {mode === "url" && (
                <div className="space-y-2">
                    <Input
                        type="url"
                        placeholder="https://exemple.com/votre-photo.jpg"
                        value={urlInput}
                        onChange={e => handleUrlChange(e.target.value)}
                        className={clsx(
                            "h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                            error
                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                : "border-gray-200"
                        )}
                    />
                    <p className="text-xs text-gray-500">
                        URL de votre photo de profil (format JPG, PNG
                        recommandé).
                    </p>
                </div>
            )}

            {/* File Upload Mode */}
            {mode === "file" && (
                <div className="space-y-2">
                    <div
                        className={clsx(
                            "relative border-dashed border-2 rounded-xl p-6 text-center cursor-pointer transition-all duration-200",
                            isDragActive
                                ? "border-blue-600 bg-blue-50 shadow-lg scale-[1.02]"
                                : isUploading
                                  ? "border-gray-300 bg-gray-50"
                                  : "border-blue-200/60 bg-white/50 hover:bg-blue-50/50 hover:border-blue-400 hover:shadow-md"
                        )}
                        onClick={() =>
                            !isUploading &&
                            document
                                .getElementById("profile-file-input")
                                ?.click()
                        }
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
                                    <div className="p-3 bg-gray-200 rounded-xl mb-3 animate-pulse">
                                        <CloudUpload className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        Upload en cours...
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-3">
                                        <CloudUpload className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800 mb-1">
                                        Glissez une image ici ou cliquez
                                    </p>
                                    <p className="text-xs text-blue-600 font-medium">
                                        JPG, PNG (max 2MB)
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview */}
            {displaySrc && (
                <Card className="bg-gray-50 border border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <Image
                                    src={displaySrc}
                                    alt="Aperçu photo de profil"
                                    fill
                                    className="object-cover"
                                    onError={() =>
                                        console.log("Image failed to load")
                                    }
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    Photo de profil sélectionnée
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {value?.startsWith("data:")
                                        ? "Image uploadée"
                                        : "Image depuis URL"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-4 h-4 text-xs">⚠</span>
                    {error}
                </p>
            )}
        </div>
    );
}

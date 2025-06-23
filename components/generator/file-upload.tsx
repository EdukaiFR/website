"use client";

import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import type { FileProcessingState } from "@/lib/types/generator";
import clsx from "clsx";
import { CircleX, CloudUpload, FileText } from "lucide-react";
import { useState } from "react";

import { FileProcessorComponent } from "@/components/recognition";
import { useBlob } from "@/hooks";
import { useBlobService } from "@/services";

type FileUploadProps = {
    selectedFiles: File[];
    setSelectedFiles: (files: File[] | ((prev: File[]) => File[])) => void;
    onFilesChange: (files: File[]) => void;
    onRecognizedText: (text: string, fileId: string) => void;
    onTextRemoved?: (fileId: string) => void;
    fileProcessingStates: FileProcessingState;
    setFileProcessingStates: (
        states:
            | FileProcessingState
            | ((prev: FileProcessingState) => FileProcessingState)
    ) => void;
    processedFiles: Set<string>;
    setProcessedFiles: (
        files: Set<string> | ((prev: Set<string>) => Set<string>)
    ) => void;
    uploadedFileIds: { [localFileId: string]: string };
    setUploadedFileIds: React.Dispatch<
        React.SetStateAction<{ [localFileId: string]: string }>
    >;
};

const MAX_CONCURRENT_PROCESSING = 2;

export function FileUpload({
    selectedFiles,
    setSelectedFiles,
    onFilesChange,
    onRecognizedText,
    onTextRemoved,
    fileProcessingStates,
    setFileProcessingStates,
    processedFiles,
    setProcessedFiles,
    setUploadedFileIds,
}: FileUploadProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const isRecognizing = Object.values(fileProcessingStates).some(Boolean);
    const currentlyProcessingCount =
        Object.values(fileProcessingStates).filter(Boolean).length;

    const blobService = useBlobService();
    const { uploadFile } = useBlob(blobService);

    const setFileProcessing = (fileId: string, isProcessing: boolean) => {
        setFileProcessingStates(prev => ({
            ...prev,
            [fileId]: isProcessing,
        }));
    };

    const isFileProcessing = (fileId: string) => {
        return fileProcessingStates[fileId] || false;
    };

    const isFileProcessed = (fileId: string) => {
        return processedFiles.has(fileId);
    };

    const handleFileUpload = async (file: File, localFileId: string) => {
        try {
            const uploadResponse = await uploadFile(file, "course");
            if (uploadResponse?.newFileId) {
                setUploadedFileIds(
                    (prev: { [localFileId: string]: string }) => ({
                        ...prev,
                        [localFileId]: uploadResponse.newFileId,
                    })
                );
            }
        } catch (error) {
            console.error("An error occured uploading files", error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);
        onFilesChange(newFiles);

        files.forEach((file, index) => {
            const localFileId = `${file.name}-${file.size}-${
                selectedFiles.length + index
            }`;
            handleFileUpload(file, localFileId);
        });
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragActive(false);
        const files = Array.from(event.dataTransfer.files);
        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);
        onFilesChange(newFiles);
    };

    const removeFile = (index: number) => {
        const fileToRemove = selectedFiles[index];
        const fileId = `${fileToRemove.name}-${fileToRemove.size}-${index}`;
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);

        setSelectedFiles(updatedFiles);
        onFilesChange(updatedFiles);

        // Notify parent about text removal
        if (onTextRemoved) {
            onTextRemoved(fileId);
        }

        // Clean up processing state
        setFileProcessingStates(prev => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
        });

        // Clean up processed files state
        setProcessedFiles(prev => {
            const updated = new Set(Array.from(prev));
            updated.delete(fileId);
            return updated;
        });
    };

    return (
        <FormItem>
            <FormLabel className="text-gray-800 font-semibold">
                Fichiers
            </FormLabel>
            <FormControl>
                <div
                    className={clsx(
                        "relative border-dashed border-2 rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
                        isDragActive
                            ? "border-blue-600 bg-blue-50 shadow-lg scale-[1.02]"
                            : "border-blue-200/60 bg-white/50 hover:bg-blue-50/50 hover:border-blue-400 hover:shadow-md"
                    )}
                    onClick={() =>
                        document.getElementById("file-input")?.click()
                    }
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        className="hidden"
                        accept=".pdf,.txt,.png,.jpg,.jpeg,.ppt"
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
                            <CloudUpload className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800 mb-2">
                            Drag & Drop tes fichiers ici ou clique sur le cadre
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                            PDF, TXT, PNG, JPG, JPEG, PPT
                        </p>
                    </div>
                </div>
            </FormControl>
            <FormDescription className="text-gray-600">
                Sélectionnes tes fichiers
            </FormDescription>
            <FormMessage />

            {/* File Preview */}
            {selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Fichiers sélectionnés :
                        </h4>
                        {isRecognizing && (
                            <div className="text-sm text-blue-600 font-medium">
                                {currentlyProcessingCount} analyse
                                {currentlyProcessingCount > 1 ? "s" : ""} en
                                cours...
                            </div>
                        )}
                    </div>
                    {selectedFiles.map((file, index) => {
                        const fileId = `${file.name}-${file.size}-${index}`;
                        const isProcessing = isFileProcessing(fileId);
                        const hasBeenProcessed = isFileProcessed(fileId);
                        const shouldQueue =
                            !hasBeenProcessed &&
                            !isProcessing &&
                            currentlyProcessingCount >=
                                MAX_CONCURRENT_PROCESSING;

                        return (
                            <div
                                key={fileId}
                                className="flex items-center justify-between p-4 border border-blue-200/60 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative p-2 bg-blue-100 rounded-lg">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                        {isProcessing && (
                                            <div className="absolute inset-0 bg-blue-100/80 rounded-lg flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">
                                            {file.name}
                                        </span>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>
                                                {Math.round(file.size / 1024)}{" "}
                                                KB
                                            </span>
                                            <span>•</span>
                                            {hasBeenProcessed ? (
                                                <span className="text-green-600 text-xs">
                                                    Importé !
                                                </span>
                                            ) : shouldQueue ? (
                                                <span className="text-orange-600 font-medium">
                                                    En file d&apos;attente...
                                                </span>
                                            ) : (
                                                <FileProcessorComponent
                                                    key={fileId}
                                                    selectedFile={file}
                                                    fileId={fileId}
                                                    onTextRecognized={(
                                                        text: string
                                                    ) =>
                                                        onRecognizedText(
                                                            text,
                                                            fileId
                                                        )
                                                    }
                                                    setIsRecognizing={(
                                                        processing: boolean
                                                    ) =>
                                                        setFileProcessing(
                                                            fileId,
                                                            processing
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    disabled={isProcessing}
                                    onClick={() => removeFile(index)}
                                >
                                    <CircleX className="w-4 h-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </FormItem>
    );
}

/* eslint-disable react-hooks/exhaustive-deps */
import {
    FileProcessor,
    ProcessingProgress,
    ProcessingResult,
} from "@/lib/file-processors";
import { fileToast } from "@/lib/toast";
import { useEffect, useRef, useState } from "react";

const FileProcessorComponent = ({
    selectedFile,
    onTextRecognized,
    setIsRecognizing,
    fileId,
    onError,
}: {
    selectedFile: File | null;
    onTextRecognized: (text: string) => void;
    setIsRecognizing: (isRecognizing: boolean) => void;
    fileId: string;
    onError?: () => void;
}) => {
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState<ProcessingProgress | null>(null);
    const hasProcessedRef = useRef(false);

    useEffect(() => {
        const processFile = async () => {
            if (selectedFile && !processing && !hasProcessedRef.current) {
                hasProcessedRef.current = true; // Mark as processed immediately to prevent re-processing
                setProcessing(true);
                setIsRecognizing(true);
                setProgress(null);

                try {
                    const result: ProcessingResult =
                        await FileProcessor.processFile(
                            selectedFile,
                            (progressUpdate: ProcessingProgress) => {
                                setProgress(progressUpdate);
                                console.log(
                                    `Processing ${fileId}: ${progressUpdate.message} (${progressUpdate.progress}%)`
                                );
                            }
                        );

                    onTextRecognized(result.text);
                    console.log(
                        `Final text from ${result.type} file (${fileId}):`,
                        result.text
                    );

                    if (result.images && result.images.length > 0) {
                        console.log(
                            `Extracted ${result.images.length} images from PDF`
                        );
                    }
                } catch (error) {
                    console.error(
                        `Erreur lors du traitement du fichier ${fileId}:`,
                        error
                    );
                    fileToast.recognitionError();
                    hasProcessedRef.current = false; // Reset on error so it can be retried
                    // Call onError callback to remove file from list
                    if (onError) {
                        onError();
                    }
                } finally {
                    // Keep processing true to continue showing percentage
                    // setProcessing(false);
                    setIsRecognizing(false);
                    // Don't clear progress to keep showing the last percentage
                    // setProgress(null);
                }
            }
        };

        processFile();
    }, [selectedFile, fileId]);

    const getFileTypeIcon = () => {
        if (!selectedFile) return null;
        const type = FileProcessor.getFileType(selectedFile);
        switch (type) {
            case "pdf":
                return "📄";
            case "image":
                return "🖼️";
            case "text":
                return "📝";
            default:
                return "📁";
        }
    };

    // Use a stable wrapper to prevent double rendering
    return (
        <span
            className={
                !processing
                    ? "text-xs text-gray-500"
                    : "text-xs text-blue-600 font-medium"
            }
            data-file-id={fileId}
        >
            {!processing
                ? "Importé !"
                : progress
                  ? `${progress.message} ${progress.progress}%`
                  : "Traitement en cours..."}
        </span>
    );
};

export { FileProcessorComponent };

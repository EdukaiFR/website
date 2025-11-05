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
                            }
                        );

                    onTextRecognized(result.text);
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

    // Use a stable wrapper to prevent double rendering
    const getStatusText = () => {
        if (!processing) return "Importé !";
        if (progress) return `${progress.message} ${progress.progress}%`;
        return "Traitement en cours...";
    };

    const getStatusClassName = () => {
        return processing
            ? "text-xs text-blue-600 font-medium"
            : "text-xs text-gray-500";
    };

    return (
        <span
            className={getStatusClassName()}
            data-file-id={fileId}
        >
            {getStatusText()}
        </span>
    );
};

export { FileProcessorComponent };

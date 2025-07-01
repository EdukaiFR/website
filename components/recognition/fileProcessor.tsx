import {
    FileProcessor,
    ProcessingProgress,
    ProcessingResult,
} from "@/lib/file-processors";
import { fileToast } from "@/lib/toast";
import { useEffect, useState } from "react";

const FileProcessorComponent = ({
    selectedFile,
    onTextRecognized,
    setIsRecognizing,
    fileId,
}: {
    selectedFile: File | null;
    onTextRecognized: (text: string) => void;
    setIsRecognizing: (isRecognizing: boolean) => void;
    fileId: string;
}) => {
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState<ProcessingProgress | null>(null);
    const [hasProcessed, setHasProcessed] = useState(false);

    useEffect(() => {
        const processFile = async () => {
            if (selectedFile && !processing && !hasProcessed) {
                setHasProcessed(true); // Mark as processed immediately to prevent re-processing
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
                    setHasProcessed(false); // Reset on error so it can be retried
                } finally {
                    setProcessing(false);
                    setIsRecognizing(false);
                    setProgress(null);
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

    const getStatusMessage = () => {
        if (!processing) {
            return (
                <div className="flex items-center gap-1">
                    <span>{getFileTypeIcon()}</span>
                    <span className="text-xs text-gray-500">Importé !</span>
                </div>
            );
        }

        if (progress) {
            return (
                <div className="flex items-center gap-1">
                    <span>{getFileTypeIcon()}</span>
                    <span className="text-xs text-blue-600 font-medium">
                        {progress.message} {progress.progress}%
                    </span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-1">
                <span>{getFileTypeIcon()}</span>
                <span className="text-xs text-blue-600 font-medium">
                    Traitement en cours...
                </span>
            </div>
        );
    };

    return <div>{getStatusMessage()}</div>;
};

export { FileProcessorComponent };
